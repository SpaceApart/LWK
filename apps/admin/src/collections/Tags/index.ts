import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'

export const Tags: CollectionConfig = {
    slug: 'tags',
    admin: {
        useAsTitle: 'label',
        defaultColumns: ['label', 'slug', 'updatedAt'],
        group: 'Tourism',
    },
    access: {
        create: authenticated,
        read: () => true, // Tags are often public
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
            name: 'label',
            type: 'text',
            required: true,
            localized: true,
        },
        {
            name: 'icon',
            type: 'text',
            label: 'Icon (Emoji or Class Name)',
            required: false,
            localized: false,
        },
        {
            name: 'tagScope',
            label: 'Tag Scope',
            type: 'select',
            required: true,
            localized: false,
            options: [
                { label: 'Offers', value: 'offers' },
                { label: 'Attractions', value: 'attractions' },
                { label: 'Experiences', value: 'experiences' },
                { label: 'Photos', value: 'photos' },
                { label: 'Posts', value: 'posts' },
            ],
            admin: {
                description: 'Select the type of content this tag relates to.',
            },
        },
        {
            name: 'slug',
            type: 'text',
            index: true,
            required: true,
            localized: true, // Slug for tags should also be localizable
            admin: {
                position: 'sidebar',
            },
            // Hooks: beforeValidate: [formatSlug('label')] can be added later for auto-generation
        },
    ],
} 