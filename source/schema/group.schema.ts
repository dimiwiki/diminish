import generalSchema from '@schema/general.schema';
import { Schema } from '@library/type';
import { Group } from '@prisma/client';

// groupSchema
export default {
	id: generalSchema['unsginedInteger32'],
	title: generalSchema['stringWithLength256']
} as Schema<keyof Group>;