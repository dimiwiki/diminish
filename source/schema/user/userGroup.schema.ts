import userSchema from '@schema/user/user.schema';
import groupSchema from '@schema/group.schema';
import { Schema } from '@library/type';
import { UserGroup } from '@prisma/client';

// userGroupSchema
export default {
	userId: userSchema['id'],
	groupId: groupSchema['id']
} as Schema<keyof UserGroup>;