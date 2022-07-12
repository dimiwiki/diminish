import { JSONSchema } from 'fluent-json-schema';
import { Category } from '@prisma/client';
import generalSchema from '@schema/general.schema';

// categorySchema
export default {
	id: generalSchema['unsginedInteger32'],
	title: generalSchema['stringWithLength256']
} as Record<keyof Category, JSONSchema>;