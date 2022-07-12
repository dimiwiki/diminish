import schema, { JSONSchema } from 'fluent-json-schema';
import { RevisionRequest } from '@prisma/client';
import generalSchema from '@schema/general.schema';
import documentSchema from '@schema/document/document.schema';
import revisionSchema from './revision.schema';

export default {
	id: generalSchema['unsginedInteger32'],
	documentId: documentSchema['id'],
	revisionId: revisionSchema['id'],
	content: schema.string().pattern(/^[a-f0-9]+$/), // XXX: since content will treated in server-side only, it will not used for checking input
	status: schema.integer().minimum(0).maximum(9),
	createdAt: schema.string().format('date-time') // XXX: since cratedAt will treated in server-side only, it will not used for checking input
} as Record<keyof RevisionRequest, JSONSchema>;