import { prisma } from '@library/database';
import { PageQuery } from '@library/type';
import { getPageCondition } from '@library/utility';
import { User } from '@prisma/client';
import { PayloadReply, FastifyRequest } from 'fastify';

export default function (request: FastifyRequest<{ Querystring: PageQuery; }>, reply: PayloadReply): void {
	prisma['user'].findMany(Object.assign({ select: {
		id: true,
		name: true,
		permission: true,
		createdAt: true
	} }, getPageCondition<User>(request['query'], 'id')))
	.then(function (users: Omit<User, 'password' | 'email' |	'verificationKey'>[]): void {
		reply.send({
			status: 'success',
			data: users
		});
		
		return;
	})
	.catch(reply.send.bind(reply));

	return;
}