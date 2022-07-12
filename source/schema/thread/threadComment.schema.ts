import schema, { JSONSchema } from 'fluent-json-schema';
import { ThreadComment } from '@prisma/client';
import documentSchema from '@schema/document/document.schema';
import generalSchema from '@schema/general.schema';
import userSchema from '@schema/user/user.schema';
import threadSchema from './thread.schema';

export default {
	id: generalSchema['unsginedInteger32'],
	threadId: threadSchema['id'],
	userId: userSchema['id'],
	content: schema.string().minLength(1).maxLength(65535),
	createdAt: schema.string().format('date-time') // XXX: since cratedAt will treated in server-side only, it will not used for checking input
} as Record<keyof ThreadComment, JSONSchema>;