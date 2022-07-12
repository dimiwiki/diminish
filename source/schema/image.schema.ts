import schema, { JSONSchema } from 'fluent-json-schema';
import { Image } from '@prisma/client';
import generalSchema from '@schema/general.schema';

export default {
	id: generalSchema['sha512'],
	title: schema.string().minLength(1).maxLength(512),
	extension: schema.integer().minimum(0).maximum(9)
} as Record<keyof Image, JSONSchema>;