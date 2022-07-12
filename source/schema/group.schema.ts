import { JSONSchema } from 'fluent-json-schema';
import { Group } from '@prisma/client';
import generalSchema from '@schema/general.schema';

// groupSchema
export default {
	id: generalSchema['unsginedInteger32'],
	title: generalSchema['stringWithLength256']
} as Record<keyof Group, JSONSchema>;