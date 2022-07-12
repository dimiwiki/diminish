import schema, { JSONSchema } from 'fluent-json-schema';
import { Revision } from '@prisma/client';
import documentSchema from '@schema/document/document.schema';
import generalSchema from '@schema/general.schema';

// revisionSchema
export default {
	id: generalSchema['unsginedInteger32'],
	documentId: documentSchema['id'],
	revisionId: generalSchema['unsginedInteger32'],
	content: schema.string().pattern(/^[a-f0-9]+$/), // XXX: since content will treated in server-side only, it will not used for checking input
	size: schema.integer().minimum(-2147483648).maximum(2147483647),
	comment: generalSchema['stringWithLength256'],
} as Record<keyof Revision, JSONSchema>;