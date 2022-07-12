import { JSONSchema } from 'fluent-json-schema';
import { AccessControl } from '@prisma/client';
import documentSchema from '@schema/document/document.schema';
import generalSchema from '@schema/general.schema';

// accessControlSchema
export default {
	id: generalSchema['unsginedInteger32'],
	documentId: documentSchema['id'],
	type: generalSchema['integerWithPrecision1'], // TODO: make type
	conditionType: generalSchema['integerWithPrecision1'], // TODO: make condition type
	condition: generalSchema['stringWithLength256'],
	message: generalSchema['stringWithLength256'],
	expiry: generalSchema['unsginedInteger32'],
	createdAt: generalSchema['dateTime'] // XXX: since cratedAt will treated in server-side only, it will not used for checking input
} as Record<keyof AccessControl, JSONSchema>;