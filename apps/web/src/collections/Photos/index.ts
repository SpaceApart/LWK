import type { CollectionConfig } from 'payload';
import { authenticated } from '../../access/authenticated';
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished';

export const Photos: CollectionConfig = {
    slug: 'photos',
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
    },
    access: {
        create: authenticated,
        read: authenticatedOrPublished,
        update: authenticated,
        delete: authenticated,
    },
    versions: {
        drafts: {
            autosave: true,
        },
        maxPerDoc: 10,
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
            localized: true,
        },
        {
            name: 'slug',
            type: 'text',
            index: true,
            required: false,
            unique: true,
            localized: true,
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'publishedAt',
            type: 'date',
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
            required: true,
            label: 'Photo Image',
        },
        {
            name: 'caption',
            type: 'text',
            required: false,
            localized: true,
        },
        {
            name: 'location_text',
            type: 'text',
            label: 'Location (Text)',
            required: false,
            localized: true,
        },
        {
            name: 'user_comment',
            type: 'textarea',
            label: 'User Comment',
            required: false,
            localized: true,
        },
        {
            name: 'related_post',
            type: 'relationship',
            relationTo: 'posts',
            label: 'Related Post',
            hasMany: false,
            required: false,
        },
        {
            name: 'rating',
            type: 'number',
            label: 'Rating (0-5)',
            required: false,
            min: 0,
            max: 5,
            admin: {
                step: 1,
            }
        }
    ],
} 