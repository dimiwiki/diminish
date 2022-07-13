import { PayloadReply, FastifyRequest } from 'fastify';

export default function (request: FastifyRequest, reply: PayloadReply): void {
	reply.send({
		status: 'success',
		data: [{
			title: 'Auth',
			body: 'User auth module'
		}]
	});

	return;
}