import { prisma } from '@library/database';
import { BadRequest } from '@library/httpError';
import { getDuplicatedElement, getEncryptedPassword, getSha512EncryptedText, sendMail } from '@library/utility';
import { User } from '@prisma/client';
import { PayloadReply, FastifyRequest } from 'fastify';

export default function (request: FastifyRequest<{ Body: Pick<User, 'name' | 'password' | 'email'>; }>, reply: PayloadReply): void {
	prisma.user.findMany({
		select: {
			name: true,
			email: true
		},
		where: { OR: [{
			name: request['body']['name']
		}, {
			email: request['body']['email']
		}] }
	})
	.then(function (duplicatedUsers: Pick<User, 'name' | 'email'>[]): void {
		const duplicatedElement: 'name' | 'email' | null = getDuplicatedElement({
			name: request['body']['name'],
			email: request['body']['email']
		} as Pick<User, 'name' | 'email'>, duplicatedUsers);

		if(duplicatedElement === null) {
			const currentTime: Date = new Date();

			getEncryptedPassword(request['body']['password'], currentTime)
			.then(function (encryptedPassword: string): void {
				const verificationKey: string = getSha512EncryptedText(request['body']['name'] + '+' + currentTime.getTime());

				prisma.user.create({
					select: { id: true },
					data: {
						name: request['body']['name'],
						password: encryptedPassword,
						email: request['body']['email'],
						permission: 1,
						verificationKey: verificationKey,
						createdAt: currentTime
					}
				})
				.then(function (user: Pick<User, 'id'>): void {
					sendMail({
						email: request['body']['email'],
						title: '디미위키 계정 인증',
						body: '<p>' + request['body']['name'] + '님, 안녕하세요.</p><br><p>계정의 생성이 확인되었습니다,</p><p><a href="http://api.dimi.wiki/auth/email?verificationKey=' + verificationKey + '">여기</a>를 눌러 이메일을 인증해주세요.</p><br><p>만약 이를 요청하지 않으셨다면, 이메일 도용의 가능성이 있으니 <a href="mailto:support@dimi.wiki">회답</a>해주시길 바랍니다.</p><br><hr><br><p>디미위키 | <a href="https://dimi.wiki/">https://dimi.wiki/</a></p>'
					})
					.then(function (): void {
						reply.send({
							status: 'success',
							data: [user]
						});
						
						return;
					})
					.catch(reply.send.bind(reply));

					return;
				})
				.catch(reply.send.bind(reply));

				return;
			})
			.catch(reply.send.bind(reply));
		} else {
			reply.send(new BadRequest('Body[\'' + duplicatedElement + '\'] should not be duplicated'));
		}
	})
	.catch(reply.send.bind(reply));

	return;
}