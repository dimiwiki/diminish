import schema, { JSONSchema } from 'fluent-json-schema';
import { AccessControl } from '@prisma/client';
import documentSchema from '@schema/document/document.schema';
import generalSchema from '@schema/general.schema';

export default {
	id: generalSchema['unsginedInteger32'],
	documentId: documentSchema['id'],
	type: schema.integer().minimum(0).maximum(9), // TODO: make type
	conditionType: schema.integer().minimum(0).maximum(9), // TODO: make condition type
	condition: schema.string().minLength(1).maxLength(256),
	message: schema.string().minLength(1).maxLength(256),
	expiry: generalSchema['unsginedInteger32'],
	createdAt: schema.string().format('date-time') // XXX: since cratedAt will treated in server-side only, it will not used for checking input
} as Record<keyof AccessControl, JSONSchema>;