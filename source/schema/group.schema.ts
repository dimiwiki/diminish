import schema, { JSONSchema } from 'fluent-json-schema';
import { Group } from '@prisma/client';
import generalSchema from '@schema/general.schema';

export default {
	id: generalSchema['unsginedInteger32'],
	title: schema.string().minLength(1).maxLength(256)
} as Record<keyof Group, JSONSchema>;