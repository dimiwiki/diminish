import schema, { JSONSchema } from 'fluent-json-schema';
import { UserConfig } from '@prisma/client';
import userSchema from '@schema/user/user.schema';
import generalSchema from '@schema/general.schema';

// userConfigSchema
export default {
	userId: userSchema['id'],
	type: schema.integer().minimum(0).maximum(99), // TODO: make config typegit
	value: generalSchema['integerWithPrecision1'] // TODO: make config value by type
} as Record<keyof UserConfig, JSONSchema>;