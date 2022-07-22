import { Module } from '@library/framework';
import { getObjectSchema } from '@library/utility';
import pageSchema from '@schema/page.schema';
import getDocumentsController from './getDocuments.controller';

export default (new Module({
	routers: [{
		method: 'GET',
		url: '',
		handler: getDocumentsController
	}],
	prefix: __dirname.split(/\\|\//).pop()
}));