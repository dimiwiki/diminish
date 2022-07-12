import schema, { JSONSchema } from 'fluent-json-schema';
import { Document } from '@prisma/client';
import generalSchema from '@schema/general.schema';

// documentSchema
export default {
	id: generalSchema['unsginedInteger32'],
	title: schema.string().minLength(1).maxLength(512),
	plain: schema.string().maxLength(16777215),
	content: schema.string().maxLength(16777215)
} as Record<keyof Document, JSONSchema>;