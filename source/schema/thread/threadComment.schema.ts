import schema, { JSONSchema } from 'fluent-json-schema';
import { ThreadComment } from '@prisma/client';
import generalSchema from '@schema/general.schema';
import userSchema from '@schema/user/user.schema';
import threadSchema from './thread.schema';

// threadCommentSchema
export default {
	id: generalSchema['unsginedInteger32'],
	threadId: threadSchema['id'],
	userId: userSchema['id'],
	content: schema.string().minLength(1).maxLength(65535),
	createdAt: generalSchema['dateTime'] // XXX: since cratedAt will treated in server-side only, it will not used for checking input
} as Record<keyof ThreadComment, JSONSchema>;