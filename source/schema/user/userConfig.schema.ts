import schema from 'fluent-json-schema';
import userSchema from '@schema/user/user.schema';
import generalSchema from '@schema/general.schema';
import { Schema } from '@library/type';
import { UserConfig } from '@prisma/client';

// userConfigSchema
export default {
	userId: userSchema['id'],
	type: schema.integer().minimum(0).maximum(99), // TODO: make config typegit
	value: generalSchema['integerWithPrecision1'] // TODO: make config value by type
} as Schema<keyof UserConfig>;