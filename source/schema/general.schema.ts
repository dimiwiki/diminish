import schema, { JSONSchema } from 'fluent-json-schema';

export default {
	unsginedInteger32: schema.integer().minimum(0).maximum(429467295),
	sha512: schema.string().pattern(/^[a-f0-9]{128}$/)
} as Record<'unsginedInteger32' | 'sha512', JSONSchema>;