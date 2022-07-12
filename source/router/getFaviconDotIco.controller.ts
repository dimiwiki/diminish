import { PayloadReply, FastifyRequest } from 'fastify';

export default function (request: FastifyRequest, reply: PayloadReply): void {
	reply.status(204);
	reply.send();

	return;
}