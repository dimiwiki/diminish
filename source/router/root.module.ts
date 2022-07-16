import { Module } from '@library/framework';
import documentsModule from './documents/documents.module';
import getFaviconDotIcoController from './getFaviconDotIco.controller';
import getRobotsDotTxtController from './getRobotsDotTxt.controller';
import getRootController from './getRoot.controller';
import usersModule from './users/users.module';

export default (new Module({
	routers: [{
		method: 'GET',
		url: '',
		handler: getRootController
	}, {
		method: 'GET',
		url: 'robots.txt',
		handler: getRobotsDotTxtController
	}, {
		method: 'GET',
		url: 'favicon.ico',
		handler: getFaviconDotIcoController
	}],
	modules: [documentsModule, usersModule]
}));