import { prisma } from '@library/database';
import { User } from '@prisma/client';
import { PayloadReply, FastifyRequest } from 'fastify';

export default function (request: FastifyRequest<{ Querystring: Pick<User, 'verificationKey'> }>, reply: PayloadReply): void {
	prisma.user.findFirst({
		select: {
			id: true,
			name: true
		},
		where: { verificationKey: request['query']['verificationKey'] }
	})
	.then(function (user: Pick<User, 'id' | 'name'> | null): void {
		if(user !== null) {
			prisma.document.create({
				select: null,
				data: {
					title: user['name'],
					type: DocumentTypeIndex['user'],
					plain: '',
					content: ''
				}
			})
			.then(function (): void {
				reply.redirect('https://dimi.wiki/login?emailAuth=true'); // TODO: change when frontend development is complete
			})
			.catch(reply.send.bind(reply));
		} else {
			reply.callNotFound();
		}

		return;
	})
	.catch(reply.send.bind(reply))

	return;
}