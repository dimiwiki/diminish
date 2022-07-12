import { PayloadReply, FastifyRequest } from 'fastify';

export default function (request: FastifyRequest, reply: PayloadReply): void {
	reply.send({
		status: 'success',
		data: [{
			title: 'Api.dimi.wiki',
			body: 'Application programming interface for dimi.wiki'
		}]
	});

	return;
}