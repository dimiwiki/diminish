import schema, { JSONSchema } from 'fluent-json-schema';
import { User } from '@prisma/client';
import generalSchema from '@schema/general.schema';

export default {
	id: generalSchema['unsginedInteger32'],
	name: schema.string().pattern(/^[A-Za-z0-9]{3,32}$/),
	password: generalSchema['sha512'],
	email: schema.string().format('email'),
	permission: schema.integer().minimum(0).maximum(9), // TODO: make permission
	verificationKey: generalSchema['sha512'],
	createdAt: schema.string().format('date-time') // XXX: since cratedAt will treated in server-side only, it will not used for checking input
} as Record<keyof User, JSONSchema>;