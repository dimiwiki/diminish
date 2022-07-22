import { prisma } from '@library/database';
import { User } from '@prisma/client';
import { PayloadReply, FastifyRequest } from 'fastify';

export default function (request: FastifyRequest<{ Params: Pick<User, 'id'> }>, reply: PayloadReply): void {
	prisma['user'].findFirst({
		select: {
			id: true,
			name: true,
			email: true,
			permission: true,
			createdAt: true
		},
		where: request['params']
	})
	.then(function (user: Omit<User, 'password' |	'verificationKey'> | null): void {
		if(user !== null) {
			reply.send({
				status: 'success',
				data: [user]
			});
		} else {
			reply.callNotFound();
		}
		
		return;
	})
	.catch(reply.send.bind(reply));

	return;
}