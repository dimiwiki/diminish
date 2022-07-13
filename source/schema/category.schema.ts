import generalSchema from '@schema/general.schema';
import { Schema } from '@library/type';
import { Category } from '@prisma/client';

// categorySchema
export default {
	id: generalSchema['unsginedInteger32'],
	title: generalSchema['stringWithLength256']
} as Schema<keyof Category>;