import { JSONSchema } from 'fluent-json-schema';
import { RevisionBlame } from '@prisma/client';
import generalSchema from '@schema/general.schema';
import documentSchema from '@schema/document/document.schema';
import revisionSchema from './revision.schema';

export default {
	documentId: documentSchema['id'],
	revisionId: revisionSchema['id'],
	line: generalSchema['unsginedInteger32']
} as Record<keyof RevisionBlame, JSONSchema>;