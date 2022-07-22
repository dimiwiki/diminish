import { PayloadReply, FastifyRequest } from 'fastify';
import { JSONWebToken } from '@library/utility';
import { Unauthorized } from '@library/httpError';
import { prisma } from '@library/database';
import { User } from '@prisma/client';

export default function (request: FastifyRequest<{ Body: { refreshToken: string; }; }>, reply: PayloadReply): void {
	try {
		const userId: number = JSON.parse(Buffer.from(request['body']['refreshToken'].split('.')[1], 'base64url').toString())['uid'];

		prisma['user'].findFirst({
			where: { id: userId },
			select: {
				password: true,
				verificationKey: true,
				permission: true
			}
		})
		.then(function (user: Pick<User, 'password' | 'verificationKey' | 'permission'> | null): void {
			if(user !== null) {
				if(user['verificationKey'] === null) {
					if((new JSONWebToken(request['body']['refreshToken'], user['password'])).isValid()) {
						reply.send({
							status: 'success',
							data: [{
								type: 'Bearer',
								accessToken: JSONWebToken.create({
									iss: 'api.h2owr.xyz',
									exp: Date.now() + 3600,
									uid: userId,
									per: user['permission']
								}, process['env']['JSON_WEB_TOKEN_SECRET'])
							}]
						});
					} else {
						reply.send(new Unauthorized('Body[\'refreshToken\'] should be authorized to access'));
					}
				} else {
					reply.send(new Unauthorized('Body[\'email\'] should be verified'));
				}
			} else {
				reply.send(new Unauthorized('Body[\'refreshToken\'] should be valid JSON Web Token'));
			}
	
			return;
		})
		.catch(reply.send.bind(reply));
	} catch {
		reply.send(new Unauthorized('Body[\'refreshToken\'] should be valid JSON Web Token'));
	}
	
	return;
}