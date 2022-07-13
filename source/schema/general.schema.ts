import schema from 'fluent-json-schema';
import { Schema } from '@library/type';

// generalSchema
export default {
	unsginedInteger32: schema.integer().minimum(0).maximum(429467295),
	sha512: schema.string().pattern(/^[a-f0-9]{128}$/),
	integerWithPrecision1: schema.integer().minimum(0).maximum(9),
	stringWithLength256: schema.string().minLength(1).maxLength(256),
	dateTime: schema.string().format('date-time')
} as Schema<'unsginedInteger32' | 'sha512' | 'integerWithPrecision1' | 'stringWithLength256' | 'dateTime'>;