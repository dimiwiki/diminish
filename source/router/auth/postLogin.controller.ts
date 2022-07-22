import { PayloadReply, FastifyRequest } from 'fastify';
import { getEncryptedPassword, JSONWebToken } from '@library/utility';
import { Unauthorized } from '@library/httpError';
import { prisma } from '@library/database';
import { User } from '@prisma/client';

export default function (request: FastifyRequest<{ Body: Pick<User, 'id' | 'password'>; }>, reply: PayloadReply): void {
	prisma['user'].findFirst({
		select: {
			id: true,
			password: true,
			permission: true,
			verificationKey: true,
			createdAt: true
		}
	})
	.then(function (user: Omit<User, 'email' | 'name'> | null): void {
		if(user !== null) {
			if(user['verificationKey'] === null) {
				getEncryptedPassword(request['body']['password'], user['createdAt'])
				.then(function (password: string): void {
					if(password === user['password']) {
						const currentTime: number = Date.now();
	
						reply.send({
							status: 'success',
							data: [{
								type: 'Bearer',
								refreshToken: JSONWebToken.create({
									iss: 'api.h2owr.xyz',
									exp: currentTime + 7776000,
									uid: user['id']
								}, password),
								accessToken: JSONWebToken.create({
									iss: 'api.h2owr.xyz',
									exp: currentTime + 3600,
									uid: user['id'],
									per: user['permission']
								}, process['env']['JSON_WEB_TOKEN_SECRET'])
							}]
						});

						return;
					} else {
						reply.send(new Unauthorized('Body[\'password\'] should be valid'));
					}
				})
				.catch(reply.send.bind(reply));
			} else {
				reply.send(new Unauthorized('Body[\'email\'] should be verified'));
			}
		} else {
			reply.send(new Unauthorized('Body[\'id\'] should be valid'));
		}

		return;
	})
	.catch(reply.send.bind(reply));

	return;
}