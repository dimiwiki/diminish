import { prisma } from '@library/database';
import { BadRequest, NotFound, Unauthorized } from '@library/httpError';
import { RejectFunction, ResolveFunction } from '@library/type';
import { getDuplicatedElement, getEncryptedPassword } from '@library/utility';
import { User } from '@prisma/client';
import { PayloadReply, FastifyRequest } from 'fastify';

export default function (request: FastifyRequest<{ Params: Pick<User, 'id'>; Body: Partial<Pick<User, 'name' | 'password' | 'email' | 'permission'> & { previousPassword: User['password'] }> }>, reply: PayloadReply): void {
	prisma['user'].findMany({
		select: {
			name: true,
			email: true
		},
		where: { AND: [{ OR: [{
			name: request['body']['name']
		}, {
			email: request['body']['email']
		}] }, { NOT: { id: request['params']['id'] } }] }
	})
	.then(function (duplicatedUsers: Pick<User, 'name' | 'email'>[]): void {
		const duplicatedElement: 'name' | 'email' | null = getDuplicatedElement({
			name: request['body']['name'],
			email: request['body']['email']
		} as Pick<User, 'name' | 'email'>, duplicatedUsers);

		if(duplicatedElement === null) {
			if(typeof(request['body']['permission']) === 'undefined' || request['user']['permission'] === 3) {
				if(typeof(request['body']['password']) === typeof(request['body']['previousPassword'])) {
					(new Promise<void>(function (resolve: ResolveFunction<void>, reject: RejectFunction): void {
						if(typeof(request['body']['password']) === 'string') {
							prisma['user'].findFirst({
								select: { password: true, createdAt: true },
								where: request['params']
							})
							.then(function (user: Pick<User, 'password' | 'createdAt'> | null): void {
								if(user !== null) {
									getEncryptedPassword(request['body']['previousPassword'] as string, user['createdAt'])
									.then(function (encryptedPreviousPassword: string): void {
										if(encryptedPreviousPassword === user['password']) {
											getEncryptedPassword(request['body']['password'] as string, user['createdAt'])
											.then(function (encryptedPassword: string): void {
												delete(request['body']['previousPassword']);
												
												request['body']['password'] = encryptedPassword;

												resolve();
												
												return;
											})
											.catch(reject);
										} else {
											reject(new BadRequest('Body[\'previousPassword\'] should be valid'));
										}
		
										return;
									})
									.catch(reject);
								} else {
									reject(new NotFound());
								}
		
								return;
							})
							.catch(reject);
						} else {
							resolve();
						}
		
						return;
					}))
					.then(function (): void {
						prisma['user'].update({
							select: null,
							data: request['body'],
							where: request['params']
						})
						.then(function (): void {
							reply.send({
								status: 'success',
								data: [Object.assign(request['params'], request['body'])]
							});
		
							return;
						})
						.catch(reply.send.bind(reply));
		
						return;
					})
					.catch(reply.send.bind(reply));
				} else {
					reply.send(new BadRequest('Body[\'password\'] and body[\'previousPassword\'] should be same type'));
				}
			} else {
				reply.send(new Unauthorized('Header[\'authorization\'] should be authorized to patch user[\'permission\']'));
			}
	
			return;
		} else {
			reply.send(new BadRequest('Body[\'' + duplicatedElement + '\'] should not be duplicated'));
		}
	})
	.catch(reply.send.bind(reply));
	
	return;
}