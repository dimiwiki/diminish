import { JSONSchema } from 'fluent-json-schema';
import { DocumentStar } from '@prisma/client';
import documentSchema from '@schema/document/document.schema';
import userSchema from '@schema/user/user.schema';

export default {
	documentId: documentSchema['id'],
	userId: userSchema['id']
} as Record<keyof DocumentStar, JSONSchema>;