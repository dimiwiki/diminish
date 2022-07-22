import { prisma } from '@library/database';
import { RejectFunction, ResolveFunction } from '@library/type';
import { Document, Prisma } from '@prisma/client';
import { PayloadReply, FastifyRequest } from 'fastify';

export default function (request: FastifyRequest<{ Body: Pick<Document, 'type'> & Record<'content', string>; }>, reply: PayloadReply): void {
	return;
}