import schema from 'fluent-json-schema';
import generalSchema from '@schema/general.schema';
import documentSchema from '@schema/document/document.schema';
import { Schema } from '@library/type';
import { Thread } from '@prisma/client';

// threadSchema
export default {
	id: generalSchema['unsginedInteger32'],
	documentId: documentSchema['id'],
	title: schema.string().minLength(1).maxLength(512),
	authorType: generalSchema['integerWithPrecision1'], // TODO: make condition type
	author: generalSchema['stringWithLength256'],
} as Schema<keyof Thread>;