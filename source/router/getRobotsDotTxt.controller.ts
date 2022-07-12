import { PayloadReply, FastifyRequest } from 'fastify';

export default function (request: FastifyRequest, reply: PayloadReply): void {
	reply.type('text/plain');
	// @ts-expect-error
	reply.send('User-agent: *\nDisallow: /');

	return;
}