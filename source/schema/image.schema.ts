import schema, { JSONSchema } from 'fluent-json-schema';
import { Image } from '@prisma/client';
import generalSchema from '@schema/general.schema';

// imageSchema
export default {
	id: generalSchema['sha512'],
	title: schema.string().minLength(1).maxLength(512),
	extension: generalSchema['integerWithPrecision1']
} as Record<keyof Image, JSONSchema>;