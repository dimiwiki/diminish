import documentSchema from '@schema/document/document.schema';
import userSchema from '@schema/user/user.schema';
import { Schema } from '@library/type';
import { DocumentStar } from '@prisma/client';

// documentStarSchema
export default {
	documentId: documentSchema['id'],
	userId: userSchema['id']
} as Schema<keyof DocumentStar>;