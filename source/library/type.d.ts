import { RouteOptions as _RouteOptions, HTTPMethods, RouteHandlerMethod, FastifyReply, FastifyLoggerInstance, FastifySchema, FastifyTypeProvider } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { Module } from '@library/framework';
import { HttpError, HttpErrorInformation } from '@library/httpError';
import { RouteGenericInterface } from 'fastify/types/route';
import { REQUIRED_ENVIRONMENT_VARIABLE_NAMES } from '@library/environment';
import { ArraySchema, BooleanSchema, IntegerSchema, NumberSchema, ObjectSchema, StringSchema } from 'fluent-json-schema';

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

export interface PageCondition<T extends string | number | symbol> {
	skip: number;
	take: number;
	orderBy: Record<T, 'desc' | 'asc'>;
}

export type ModelName = keyof (typeof import('@prisma/client')['Prisma'])['ModelName'];

export type ResolveFunction<T = void> = (value: T | PromiseLike<T>) => void;

export type RejectFunction = (reason?: any) => void;