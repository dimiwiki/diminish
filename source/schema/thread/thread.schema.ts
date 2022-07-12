import schema, { JSONSchema } from 'fluent-json-schema';
import { Thread } from '@prisma/client';
import documentSchema from '@schema/document/document.schema';
import generalSchema from '@schema/general.schema';
import userSchema from '@schema/user/user.schema';

// threadSchema
export default {
	id: generalSchema['unsginedInteger32'],
	documentId: documentSchema['id'],
	userId: userSchema['id'],
	title: schema.string().minLength(1).maxLength(512)
} as Record<keyof Thread, JSONSchema>;