import schema from 'fluent-json-schema';
import generalSchema from '@schema/general.schema';
import documentSchema from '@schema/document/document.schema';
import userSchema from '@schema/user/user.schema';
import { Schema } from '@library/type';
import { Thread } from '@prisma/client';

// threadSchema
export default {
	id: generalSchema['unsginedInteger32'],
	documentId: documentSchema['id'],
	userId: userSchema['id'],
	title: schema.string().minLength(1).maxLength(512)
} as Schema<keyof Thread>;