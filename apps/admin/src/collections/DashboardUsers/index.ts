import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

const DashboardUsers: CollectionConfig = {
  slug: 'dashboard-users',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['firstName', 'lastName', 'email', 'clerkId'],
    useAsTitle: 'email',
    group: 'System',
  },
  fields: [
    {
      name: 'clerkId',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Unique identifier from Clerk authentication system',
        readOnly: true,
      },
      index: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      admin: {
        description: 'User email address from Clerk',
      },
      index: true,
    },
    {
      name: 'firstName',
      type: 'text',
      admin: {
        description: 'User first name from Clerk',
      },
    },
    {
      name: 'lastName',
      type: 'text',
      admin: {
        description: 'User last name from Clerk',
      },
    },
    {
      name: 'imageUrl',
      type: 'text',
      admin: {
        description: 'Profile image URL from Clerk',
      },
    },
    {
      name: 'username',
      type: 'text',
      admin: {
        description: 'Username from Clerk (if available)',
      },
    },
    {
      name: 'lastSignInAt',
      type: 'date',
      admin: {
        description: 'Last sign in timestamp from Clerk',
      },
    },
    {
      name: 'createdAt',
      type: 'date',
      admin: {
        description: 'Account creation timestamp from Clerk',
        readOnly: true,
      },
    },
    {
      name: 'banned',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether the user is banned from Clerk',
      },
    },
    {
      name: 'locked',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether the user account is locked in Clerk',
      },
    },
  ],
  timestamps: true,
}

export default DashboardUsers 