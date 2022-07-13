import { Module } from '@library/framework';
import { getObjectSchema } from '@library/utility';
import { User } from '@prisma/client';
import schema from 'fluent-json-schema';
import userSchema from '@schema/user/user.schema';
import getAuthController from './getAuth.controller';
import getEmailController from './getEmail.controller';
import postLoginController from './postLogin.controller';
import postTokenController from './postToken.controller';

export default (new Module({
	routers: [{
		method: 'GET',
		url: '',
		handler: getAuthController
	}, {
		method: 'POST',
		url: 'login',
		handler: postLoginController,
		schema: { body: getObjectSchema<keyof Pick<User, 'id' | 'password'>>({
			id: userSchema['id'].required(),
			password: userSchema['password'].required()
		}) }
	}, {
		method: 'POST',
		url: 'token',
		handler: postTokenController,
		schema: { body: getObjectSchema<'refreshToken'>({ refreshToken: schema.string().pattern(/^([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-\+\/=]*)$/) }).required() }
	}, {
		method: 'GET',
		url: 'email',
		handler: getEmailController,
		schema: { querystring: getObjectSchema<keyof Pick<User, 'verificationKey'>>({ verificationKey: userSchema['verificationKey'].required() }) }
	}],
	prefix: __dirname.split(/\\|\//).pop()
}));