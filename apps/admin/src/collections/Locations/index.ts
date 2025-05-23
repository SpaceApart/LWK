import type { CollectionConfig } from 'payload';
import { authenticated } from '../../access/authenticated';
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished';
// import { slugField } from '@/fields/slug'; // Można dodać później dla automatycznego generowania sluga

export const Locations: CollectionConfig = {
    slug: 'locations',
    admin: {
        useAsTitle: 'name',
        defaultColumns: ['name', 'slug', 'updatedAt'],
    },
    access: {
        create: authenticated,
        read: authenticatedOrPublished, // Lub () => true, jeśli lokalizacje mają być zawsze publiczne
        update: authenticated,
        delete: authenticated,
    },
    versions: {
        drafts: {
            autosave: true,
        },
        maxPerDoc: 10,
    },
    // timestamps: true, // Domyślnie włączone
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
            localized: true,
        },
        {
            name: 'slug',
            type: 'text',
            index: true,
            required: true,
            unique: true, // Slug powinien być unikalny
            localized: true,
            admin: {
                position: 'sidebar',
            },
            // hooks: { // Można dodać później
            //   beforeValidate: [
            //     formatSlug('name'), // Funkcja do automatycznego generowania sluga z nazwy
            //   ],
            // },
        },
        // Można tu dodać więcej pól specyficznych dla lokalizacji, np. współrzędne, opis itp.
    ],
};

