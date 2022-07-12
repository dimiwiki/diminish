import { DEFAULT_RATE_LIMIT, IS_DEVELOPMENT, PORT } from '@library/environment';
import { fastify, FastifyError, FastifyInstance, PayloadReply, FastifyRequest, HTTPMethods, RouteOptions, FastifyReply } from 'fastify';
import { MethodNotAllowed, NotFound, TooManyRequests } from '@library/httpError';
import { RouterRegistry, Logger } from '@library/framework';
import { JSONWebToken } from '@library/utility';
import { redis } from '@library/database';
import { PrismaClient } from '@prisma/client';

const application: FastifyInstance = fastify({
	trustProxy: true,
	exposeHeadRoutes: false,
	logger: new Logger()
});

application['log'].info('Configured as ' + (IS_DEVELOPMENT ? 'Development' : 'Production') + ' mode');

const routerRegistry: RouterRegistry = new RouterRegistry();

application.addHook('onRoute', function (options: RouteOptions): void {
	if(!routerRegistry.isRouteRegistered(options['url'])) {
		routerRegistry.register('OPTIONS', options['url']);

		application.options(options['url'], function (request: FastifyRequest, reply: PayloadReply): void {
			reply.header('allow', routerRegistry.getRegisteredMethods(options['url']).join(', '));
			
			reply.send({
				status: 'success',
				data: null
			});

			return;
		});
	}
	
	routerRegistry.register(options['method'] as HTTPMethods, options['url']);

	return;
});

application.setNotFoundHandler(function (request: FastifyRequest, reply: FastifyReply): void {
	reply.send(new NotFound('Page not found'));
	
	return;
});

application.setErrorHandler(function (error: FastifyError, request: FastifyRequest, reply: FastifyReply): void {
	const isStackAvailable: boolean = typeof(error['stack']) === 'string' && process['env']['NODE_ENV'] === 'development';

	if(isStackAvailable) {
		// @ts-expect-error
		error['stack'] = error['stack'].replace(/\n\s{3}/g, ';');
	}

	if(typeof(error['validation']) === 'object') {
		error['statusCode'] = 400;
	} else if(typeof(error['statusCode']) !== 'number') {
		error['statusCode'] = 500;
	}

	reply.status(error['statusCode']).send(error['statusCode'] < 500 ? {
		status: 'fail',
		data: [Object.assign({
			title: error['message']
		}, IS_DEVELOPMENT && isStackAvailable ? { body: error['stack'] } : undefined)]
	} : {
		status: 'error',
		code: error['statusCode'],
		message: error['message'] + (isStackAvailable ? '; ' + error['stack'] : '')
	});

	return;
});

application.addHook('onRequest', function (request: FastifyRequest, reply: PayloadReply, done: () => void): void {
	if(!request['is404']) {
		request['user'] = {
			id: '',
			permission: 0,
			rateLimit: DEFAULT_RATE_LIMIT * 60
		};

		redis.incrby('rateLimit:' + request['ip'], 1)
		.then(function (requestCount: number): void {
			if(requestCount < 2) {
				if(requestCount === 1) {
					redis.expire('rateLimit:' + request['ip'], 60);
				}

				requestCount = 1;
			}

			if(typeof(request['headers']['authorization']) === 'string' && request['headers']['authorization'].slice(0, 7) === 'Bearer ') {
				const jsonWebToken: JSONWebToken = new JSONWebToken(request['headers']['authorization'].slice(7), process['env']['JSON_WEB_TOKEN_SECRET']);

				if(jsonWebToken.isValid()) {
					request['user']['id'] = jsonWebToken['payload']['uid'] as string;
					request['user']['permission'] = jsonWebToken['payload']['per'];
					request['user']['rateLimit'] = jsonWebToken['payload']['rat'];
				} else {
					request['id'] = 'error:value';
				}
			} else {
				request['id'] = 'error:type';
			}

			if(request['user']['rateLimit'] * 60 >= requestCount) {
				done();
			} else {
				reply.send(new TooManyRequests('Request per minute should not exeed rate limit'));
			}

			return;
		})
		.catch(reply.send.bind(reply));
	} else {
		reply.send(routerRegistry.isRouteRegistered(request['url']) ? new MethodNotAllowed('Method not allowed') : new NotFound('Page not found'));
	}

	return;
});

application['log'].info('Database connected');

(new PrismaClient()).$connect()
.then(function (): void {
	require('./router/root.module').default.appendPrefix('/').register(application)
	.then(function (): void {
		application['log'].info('Routes registered');

		application.listen({
			host: '0.0.0.0',
			port: PORT
		})
		.then(function (): void {
			application['log'].info('Route tree:');

			const routeLines: string[] = application.printRoutes({ commonPrefix: false }).split(/^(└──\s|\s{4})/gm).slice(2);

			for(let i: number = 0; i < routeLines['length']; i++) {
				if(i % 2 === 0) {
					application['log'].info(routeLines[i].replace('\n', ''));
				}
			}

			return;
		})
		.catch(application['log'].fatal);

		return;
	})
	.catch(application['log'].fatal);

	return;
})
.catch(application['log'].fatal);