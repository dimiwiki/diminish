import schema from 'fluent-json-schema';
import { Schema } from '@library/type';

// pageSchema
export default {
	'page[size]': schema.integer().minimum(0).maximum(Number['MAX_SAFE_INTEGER']),
	'page[index]': schema.integer().minimum(0).maximum(Number['MAX_SAFE_INTEGER']),
	'page[order]': schema.string().pattern(/^(de|a)sc$/)
} as Schema<'page[size]' | 'page[index]' | 'page[order]'>;