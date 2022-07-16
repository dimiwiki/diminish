import schema from 'fluent-json-schema';
import generalSchema from '@schema/general.schema';
import documentSchema from '@schema/document/document.schema';
import { Schema } from '@library/type';
import { Revision } from '@prisma/client';

// revisionSchema
export default {
	id: generalSchema['unsginedInteger32'],
	documentId: documentSchema['id'],
	revisionId: generalSchema['unsginedInteger32'],
	authorType: generalSchema['integerWithPrecision1'], // TODO: make condition type
	author: generalSchema['stringWithLength256'],
	content: schema.string().pattern(/^[a-f0-9]+$/), // XXX: since content will treated in server-side only, it will not used for checking input
	size: schema.integer().minimum(-2147483648).maximum(2147483647),
	comment: generalSchema['stringWithLength256'],
	createdAt: generalSchema['dateTime']
} as Schema<keyof Revision>;