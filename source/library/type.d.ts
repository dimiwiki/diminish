import { RouteOptions as _RouteOptions, HTTPMethods, RouteHandlerMethod, FastifyReply, FastifyLoggerInstance, FastifySchema, FastifyTypeProvider } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { Module } from '@library/framework';
import { HttpError, HttpErrorInformation } from '@library/httpError';
import { RouteGenericInterface } from 'fastify/types/route';
import { ResolveFastifyRequestType } from 'fastify/types/type-provider';
import { REQUIRED_ENVIRONMENT_VARIABLE_NAMES } from '@library/environment';
import { ArraySchema, BooleanSchema, IntegerSchema, NumberSchema, ObjectSchema, S, StringSchema } from 'fluent-json-schema';

declare global {
	namespace NodeJS {
		interface ProcessEnv extends Record<typeof REQUIRED_ENVIRONMENT_VARIABLE_NAMES[number], string> {
			NODE_ENV: 'development' | 'production';
		}
	}
}

interface NormalResponse {
	status: 'success' | 'fail';
	data: Record<string, any> | null;
}

interface ErrorResponse {
	status: 'error';
	message: string;
	code?: number;
	data?: NormalResponse['data'];
}

interface Reply extends RouteGenericInterface {
	Reply: NormalResponse | ErrorResponse | HttpError<keyof typeof HttpErrorInformation>
}

declare module 'fastify' {
  interface FastifyRequest {
    user: {
			id: string;
			permission: number;
		}
  }

	type PayloadReply = FastifyReply<Server, IncomingMessage, ServerResponse, Reply, unknown, FastifySchema, FastifyTypeProvider, Reply['Reply']>;
}

interface RouteOptions extends Omit<_RouteOptions, 'handler'> {
	method: HTTPMethods;
	//handler: RouteHandlerMethod<Server, IncomingMessage, ServerResponse, any, unknown, FastifySchema, FastifyTypeProvider, ResolveFastifyRequestType<FastifyTypeProvider, FastifySchema, any>, FastifyLoggerInstance>;
	handler: RouteHandlerMethod<Server, IncomingMessage, ServerResponse, any, any, FastifySchema, FastifyTypeProvider, any, FastifyLoggerInstance>;
}

interface ModuleOptions {
	routers: RouteOptions[];
	modules?: Module[];
	prefix?: string;
}

type RecursiveRecord<T extends string | number | symbol, S> = {
	[key in T]: S | RecursiveRecord<T, S>;
};

export type Schema<T extends string> = Record<T, ObjectSchema | StringSchema | NumberSchema | ArraySchema | IntegerSchema | BooleanSchema>;

export interface PageQuery {
	'page[size]'?: number;
	'page[index]'?: number;
	'page[order]'?: 'desc' | 'asc';
}