import schema from 'fluent-json-schema';
import generalSchema from '@schema/general.schema';
import documentSchema from '@schema/document/document.schema';
import revisionSchema from './revision.schema';
import { Schema } from '@library/type';
import { RevisionRequest } from '@prisma/client';

// revisionRequestSchema
export default {
	id: generalSchema['unsginedInteger32'],
	documentId: documentSchema['id'],
	revisionId: revisionSchema['id'],
	content: schema.string().pattern(/^[a-f0-9]+$/), // XXX: since content will treated in server-side only, it will not used for checking input
	status: generalSchema['integerWithPrecision1'],
	createdAt: generalSchema['dateTime'] // XXX: since cratedAt will treated in server-side only, it will not used for checking input
} as Schema<keyof RevisionRequest>;