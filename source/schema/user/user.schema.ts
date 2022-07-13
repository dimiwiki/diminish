import schema from 'fluent-json-schema';
import generalSchema from '@schema/general.schema';
import { Schema } from '@library/type';
import { User } from '@prisma/client';

// userSchema
export default {
	id: generalSchema['unsginedInteger32'],
	name: schema.string().pattern(/^[A-Za-z0-9]{3,32}$/),
	password: generalSchema['sha512'],
	email: schema.string().format('email'),
	permission: generalSchema['integerWithPrecision1'], // TODO: make permission
	verificationKey: generalSchema['sha512'],
	createdAt: generalSchema['dateTime'] // XXX: since cratedAt will treated in server-side only, it will not used for checking input
} as Schema<keyof User>;