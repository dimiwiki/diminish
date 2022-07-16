import { Module } from '@library/framework';
import { getObjectSchema } from '@library/utility';
import pageSchema from '@schema/page.schema';
import userSchema from '@schema/user/user.schema';
import getUserController from './getUser.controller';
import getUsersController from './getUsers.controller';
import patchUserController from './patchUser.controller';

export default (new Module({
	routers: [{
		method: 'GET',
		url: '',
		schema: { querystring: getObjectSchema(pageSchema) },
		handler: getUsersController
	}, {
		method: 'GET',
		url: ':id',
		schema: { params: getObjectSchema({ id: userSchema['id'].required() }) },
		handler: getUserController
	}, {
		method: 'PATCH',
		url: ':id',
		schema: { params: getObjectSchema({ id: userSchema['id'].required() }) },
		handler: patchUserController
	}],
	prefix: __dirname.split(/\\|\//).pop()
}));