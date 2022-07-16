import schema from 'fluent-json-schema';
import generalSchema from '@schema/general.schema';
import threadSchema from '@schema/thread/thread.schema';
import { Schema } from '@library/type';
import { ThreadComment } from '@prisma/client';

// threadCommentSchema
export default {
	id: generalSchema['unsginedInteger32'],
	threadId: threadSchema['id'],
	authorType: generalSchema['integerWithPrecision1'], // TODO: make condition type
	author: generalSchema['stringWithLength256'],
	content: schema.string().minLength(1).maxLength(65535),
	createdAt: generalSchema['dateTime'] // XXX: since cratedAt will treated in server-side only, it will not used for checking input
} as Schema<keyof ThreadComment>;