
import { FastifyBaseLogger, FastifyInstance, FastifyReply, FastifyRequest, HTTPMethods, LogLevel } from 'fastify';
import { FastifySchemaValidationError } from 'fastify/types/schema';
import { join } from 'path/posix';
import { MethodNotAllowed, Unauthorized } from '@library/httpError';
import { ModuleOptions } from '@library/type';
import { Socket } from 'net';

const HTTPMethodSequences: Record<HTTPMethods, number> = {
	POST: 0,
	PATCH: 1,
	GET: 2,
	DELETE: 3,
	OPTIONS: 4,
	HEAD: -1,
	PUT: -1
};

export class Module {
	private moduleOptions: Required<ModuleOptions>;

	constructor(moduleOptions: ModuleOptions) {
		moduleOptions['modules'] = moduleOptions['modules'] || [];
		moduleOptions['prefix'] = moduleOptions['prefix'] || '';
		this['moduleOptions'] = moduleOptions as Required<ModuleOptions>;

		return;
	}

	public static authHandler(request: FastifyRequest, reply: FastifyReply, done: () => void): void {
		if(request['id'] !== 'error:type') {
			if(request['id'] !== 'error:value') {
				const httpMethodIndex: number | undefined = HTTPMethodSequences[request['method'].toUpperCase() as HTTPMethods];

				if(typeof(httpMethodIndex) === 'number') {
					// TODO: implement authentication logic

					done();
				} else {
					reply.send(new MethodNotAllowed('Request[\'method\'] should be valid method(POST, GET, PATCH, DELETE, OPTIONS)'));
				}
			} else {
				reply.send(new Unauthorized('Header[\'authorization\'] value should be valid JSON Web Token'));
			}
		} else {
			reply.send(new Unauthorized('Header[\'authorization\'] type should be \'Bearer\''));
		}
	
		return;
	}

	public register(fastifyInstance: FastifyInstance): Promise<void> {
		const prefix: string = this['moduleOptions']['prefix'];

		for(let i: number = 0; i < this['moduleOptions']['routers']['length']; i++) {
			fastifyInstance.route(Object.assign(this['moduleOptions']['routers'][i], { url: join(fastifyInstance['prefix'] || '', prefix, this['moduleOptions']['routers'][i]['url']),  }, typeof(this['moduleOptions']['routers'][i]) !== 'undefined' ? { schemaErrorFormatter: function (errors: FastifySchemaValidationError[], dataVariableName: string): Error {
				dataVariableName = dataVariableName.charAt(0).toUpperCase() + dataVariableName.slice(1);

				if(errors[0]['instancePath']['length'] !== 0) {
					const instancePaths: string[] = errors[0]['instancePath'].slice(1).split('.');

					for(let i: number = 0; i < instancePaths['length']; i++) {
						let quote: string = instancePaths[i].includes('\'') ? '`' : '\'';
		
						dataVariableName += '[' + quote + instancePaths[i] + quote + ']';
					}
				}
				
				return new Error(dataVariableName + ' ' + errors[0]['message']);
			} } : undefined));
		}


		return (Array.isArray(this['moduleOptions']['modules']) ? this['moduleOptions']['modules'] : []).reduce(function (promise: Promise<void>, module: Module): Promise<void> {
			return promise.then(function (): Promise<void> {
				module.appendPrefix(prefix);
				return module.register(fastifyInstance);
			});
		}, Promise.resolve());
	}

	public appendPrefix(prefix: string): this {
		this['moduleOptions']['prefix'] = join(prefix, this['moduleOptions']['prefix']);

		return this;
	}
}

export class RouterRegistry {
	/*
		10000 POST
		01000 PATCH
		00100 GET
		00010 DELETE
		00001 OPTIONS
	*/
	private methodModes = {
		POST: 16,
		PATCH: 8,
		GET: 4,
		DELETE: 2,
		OPTIONS: 1,
		HEAD: 0,
		PUT: 0
	} as const;
	private urlModes: Record<string, number> = {};
	private methods: HTTPMethods[];

	constructor() {
		this['methods'] = Object.keys(this['methodModes']) as HTTPMethods[];
	}

	public register(method: HTTPMethods, url: string): void {
		if(typeof(this['urlModes'][url]) !== 'number') {
			this['urlModes'][url] = 0;
		}

		this['urlModes'][url] |= this['methodModes'][method];
	}

	public isRouteRegistered(url: string): boolean {
		return typeof(this['urlModes'][url]) === 'number';
	}

	public getRegisteredMethods(url: string): HTTPMethods[] {
		const methods: HTTPMethods[] = [];

		for(let i = 0; i < this['methods']['length']; i++) {
			if((this['urlModes'][url] & this['methodModes'][this['methods'][i]]) !== 0) {
				methods.push(this['methods'][i]);
			}
		}

		return methods;
	}
}

export class Logger implements FastifyBaseLogger {
	level: LogLevel | 'silent' = 'silent';
	
	static log(level: LogLevel, _arguments: Record<string, any>): void {
		if(typeof(_arguments[0]['req']) === 'undefined') {
			let print: Socket['write'];
			let levelColor: number = 32;

			switch(level) {
				case 'error':
				case 'fatal': {
					print = process.stderr.write.bind(process.stderr);
					levelColor--;

					break;
				}

				case 'warn': {
					levelColor++;
				}
				
				default: {
					print = process.stdout.write.bind(process.stdout);
				}
			}

			print('[\x1b[36m' + (new Date()).toTimeString().slice(0, 8) + '\x1b[37m][\x1b[' + levelColor + 'm' + level.toUpperCase() + '\x1b[37m]' + ' '.repeat(6 - level['length']));

			switch(typeof(_arguments[0])) {
				case 'string': {
					print(_arguments[0]);

					break;
				}
				

				case 'object': {
					if(typeof(_arguments[0]['res']) === 'object') {
						print(_arguments[0]['res']['request']['ip'] + ' "' + _arguments[0]['res']['request']['method'] + ' ' + decodeURIComponent(_arguments[0]['res']['request']['url']) + ' HTTP/' + _arguments[0]['res']['raw']['req']['httpVersion'] + '" ' + _arguments[0]['res']['raw']['statusCode'] + ' "' + _arguments[0]['res']['request']['headers']['user-agent'] + '" (' + Math.trunc(_arguments[0]['responseTime']) + 'ms)');
					}
					
					break;
				}
			}

			print('\n');
		}

		return;
	}

  public info(..._arguments: unknown[]): void {
		Logger.log('info', _arguments);

		return;
	}

  public warn(..._arguments: unknown[]): void {
		Logger.log('warn', _arguments);

		return;
	}

  public error(..._arguments: unknown[]): void {
		Logger.log('error', _arguments);

		return;
	}

  public fatal(..._arguments: unknown[]): void {
		Logger.log('fatal', _arguments);

		return;
	}

  public trace(..._arguments: unknown[]): void {
		Logger.log('trace', _arguments);

		return;
	}

  public debug(..._arguments: unknown[]): void {
		Logger.log('debug', _arguments);

		return;
	}


	public silent(): void {
		return;
	}

	// @ts-expect-error
	public child(): FastifyBaseLogger {
		// @ts-expect-error
		return this;
	}
}