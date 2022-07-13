import generalSchema from '@schema/general.schema';
import documentSchema from '@schema/document/document.schema';
import revisionSchema from '@schema/revision/revision.schema';
import { Schema } from '@library/type';
import { RevisionBlame } from '@prisma/client';

// revisionBlameSchema
export default {
	documentId: documentSchema['id'],
	revisionId: revisionSchema['id'],
	line: generalSchema['unsginedInteger32']
} as Schema<keyof RevisionBlame>;