import { prisma } from '@library/database';
import { User } from '@prisma/client';
import { PayloadReply, FastifyRequest } from 'fastify';

export default function (request: FastifyRequest<{ Querystring: Pick<User, 'verificationKey'> }>, reply: PayloadReply): void {
	prisma.user.findFirst({
		select: { id: true },
		where: { verificationKey: request['query']['verificationKey'] }
	})
	.then(function (user: Pick<User, 'id'> | null): void {
		if(user !== null) {
			reply.redirect('https://dimi.wiki/login?emailAuth=true'); // TODO: change when frontend development is complete
		} else {
			reply.callNotFound();
		}

		return;
	})
	.catch(reply.send.bind(reply))

	return;
}