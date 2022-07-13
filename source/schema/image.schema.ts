import schema from 'fluent-json-schema';
import generalSchema from '@schema/general.schema';
import { Schema } from '@library/type';
import { Image } from '@prisma/client';

// imageSchema
export default {
	id: generalSchema['sha512'],
	title: schema.string().minLength(1).maxLength(512),
	extension: generalSchema['integerWithPrecision1']
} as Schema<keyof Image>;