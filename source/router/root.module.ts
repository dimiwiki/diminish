import { Module } from '@library/framework';
import getFaviconDotIcoController from './getFaviconDotIco.controller';
import getRobotsDotTxtController from './getRobotsDotTxt.controller';
import getRootController from './getRoot.controller';

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
}));