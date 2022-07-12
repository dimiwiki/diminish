import { JSONSchema } from 'fluent-json-schema';
import { UserGroup } from '@prisma/client';
import userSchema from '@schema/user/user.schema';
import groupSchema from '@schema/group.schema';

// userGroupSchema
export default {
	userId: userSchema['id'],
	groupId: groupSchema['id']
} as Record<keyof UserGroup, JSONSchema>;