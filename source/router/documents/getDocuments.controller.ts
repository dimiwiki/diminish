import { prisma } from '@library/database';
import { PageQuery } from '@library/type';
import { getPageCondition } from '@library/utility';
import { Document } from '@prisma/client';
import { PayloadReply, FastifyRequest } from 'fastify';

export default function (request: FastifyRequest<{ Querystring: PageQuery & Pick<Document, 'title'>; }>, reply: PayloadReply): void {
	prisma['document'].findMany(getPageCondition<Document>(request['query'], 'id'))
	.then(function (documents: Document[]): void {
		reply.send({
			status: 'success',
			data: documents
		});
		
		return;
	})
	.catch(reply.send.bind(reply));

	return;
}