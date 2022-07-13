import schema from 'fluent-json-schema';
import generalSchema from '@schema/general.schema';
import { Schema } from '@library/type';
import { Document } from '@prisma/client';

// documentSchema
export default {
	id: generalSchema['unsginedInteger32'],
	title: schema.string().minLength(1).maxLength(512),
	plain: schema.string().maxLength(16777215),
	content: schema.string().maxLength(16777215)
} as Schema<keyof Document>;