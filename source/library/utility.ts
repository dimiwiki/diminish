import { createHash, createHmac, pbkdf2 } from 'crypto';
import schema, { JSONSchema, ObjectSchema, StringSchema } from 'fluent-json-schema';
import { createTransport, Transporter } from 'nodemailer';
import { DEFAULT_PAGE_SIZE, PBKDF_ITERATION } from '@library/environment';
import { PageCondition, PageQuery, RecursiveRecord, RejectFunction, ResolveFunction } from '@library/type';

export function getEncryptedPassword(password: string, createdAt: Date): Promise<string> {
	return new Promise<string>(function (resolve: ResolveFunction<string>, reject: RejectFunction): void {
		pbkdf2(password, createHash('sha256').update(String(Math.trunc(createdAt.getTime() / 1000))).digest('hex'), PBKDF_ITERATION, 64, 'sha512', function (error: Error | null, derivedKey: Buffer): void {
			if(error === null) {
				resolve(derivedKey.toString('hex'));
			} else {
				reject(error);
			}

			return;
		});
	});
}

export class JSONWebToken {
	private token: string;
	private secretKey: string;
	private _payload: Record<string, any>;

	constructor(token: string, secretKey: string) {
		this['token'] = token;
		this['_payload'] = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString('utf-8'));
		this['secretKey'] = secretKey;

		return;
	}

	public static create(payload: Record<string, any>, secretKey: string): string {
		const headerAndPayload: string = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.' + Buffer.from(JSON.stringify(payload)).toString('base64url');

		return headerAndPayload + '.' + createHmac('sha512', secretKey).update(headerAndPayload).digest('base64url');
	}

	public isValid(): boolean {
		const splitTokens: readonly string[] = this['token'].split('.');

		return createHmac('sha512', this['secretKey']).update(splitTokens.slice(0, 2).join('.')).digest('base64url') === splitTokens[2] && this['_payload']['exp'] as number > Math.trunc(Date.now() / 1000) && this['_payload']['iss'] === 'api.h2owr.xyz';
	}

	public get payload(): Record<string, any> {
		return JSON.parse(JSON.stringify(this['_payload']));
	}
}

export function getFieldSchema(fields: string[]): StringSchema {
	const connectedField: string = fields.join('|');

	return schema.string().pattern(new RegExp('^(?!.*(' + connectedField + ').*\\1)(' + connectedField + ')(,(' + connectedField + '))*$'));
}

const transport: Transporter = createTransport({
	host: 'smtp.daum.net',
	port: 587,
	secure: true,
	auth: {
		user: process['env']['EMAIL_USER'],
		pass: process['env']['EMAIL_PASSWORD']
	}
});

export function sendMail(options: {
	email: string;
	title: string;
	body: string;
}): Promise<void> {
	return new Promise<void>(function (resolve: ResolveFunction, reject: RejectFunction): void {
		transport.sendMail({
			// @ts-expect-error
			from: '디미위키 <' + transport['options']['auth']['user'] + '>',
			to: options['email'],
			subject: options['title'],
			html: options['body']
		})
		.then(resolve)
		.catch(reject);

		return;
	});
}

export function getObjectSchema<T extends string>(object: RecursiveRecord<T, JSONSchema>, options?: { allowAdditionalProperties?: boolean }): ObjectSchema {
	const allowAdditionalProperties: boolean = typeof(options) === 'object' && typeof(options['allowAdditionalProperties']) === 'boolean' && options['allowAdditionalProperties'];
	const schmeaNames: readonly T[] = Object.keys(object) as T[];
	
	let _schema: ObjectSchema = schema.object().additionalProperties(allowAdditionalProperties);

	for(let i: number = 0; i < schmeaNames['length']; i++) {
		_schema = _schema.prop(schmeaNames[i], object[schmeaNames[i]].hasOwnProperty('isFluentJSONSchema') ? object[schmeaNames[i]] as JSONSchema : getObjectSchema(object[schmeaNames[i]] as RecursiveRecord<T, JSONSchema>, { allowAdditionalProperties: allowAdditionalProperties }));
	}

	return _schema.readOnly(true);
}

export function getPageCondition<T>(query: PageQuery, orderCriterion: keyof T): PageCondition<keyof T> {
	const pageSize: number = query['page[size]'] || DEFAULT_PAGE_SIZE;
	
	return {
		skip: pageSize * (query['page[index]'] || 0),
		take: pageSize,
		orderBy: { [orderCriterion]: query['page[order]'] !== 'asc' ? 'desc' : 'asc' } as PageCondition<keyof T>['orderBy']
	};
}

export function getDuplicatedElement<T extends string>(comparer: Record<T, any>, targets: Record<T, any>[]): T | null {
	const elements: T[] = Object.keys(comparer) as T[];

	for(let i: number = 0; i < targets['length']; i++) {
		for(let j: number = 0; j < elements['length']; j++) {
			if(comparer[elements[j]] === targets[i][elements[j]]) {
				return elements[j];
			}
		}
	}

	return null;
}

export function getSha512EncryptedText(text: string): string {
	return createHash('sha512').update(text).digest('hex');
} 