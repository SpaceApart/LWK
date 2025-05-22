import type { CollectionConfig } from 'payload';
import { authenticated } from '../../access/authenticated';
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished';

export const Attractions: CollectionConfig = {
    slug: 'attractions',
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
            required: true,
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
            name: 'description',
            type: 'richText',
            required: true,
            localized: true,
        },
        {
            name: 'address_text',
            label: 'Address (for Geocoding)',
            type: 'text',
            required: false,
            localized: true,
            admin: {
                description: 'Enter an address to attempt automatic geocoding. Coordinates will populate the Location (Map Coordinates) field.'
            }
        },
        {
            name: 'location_map',
            type: 'point', // [longitude, latitude]
            label: 'Location (Map Coordinates)',
            required: false,
            localized: false,
            admin: {
                description: 'Współrzędne [długość, szerokość geograficzna]. Kliknij na mapie lub wprowadź ręcznie.',
                components: {
                    Field: '@/components/LocationPicker/LocationPicker',
                },
            } 
        },
        { 
            name: 'images',
            type: 'array',
            label: 'Images',
            minRows: 1,
            localized: true,
            fields: [
                {
                    name: 'image',
                    type: 'upload',
                    relationTo: 'media',
                    required: true,
                },
            ],
        },
        {
            name: 'author_note',
            type: 'textarea',
            label: 'Author Note',
            required: false,
            localized: false,
        },
        {
            name: 'rating_avg',
            type: 'number',
            label: 'Average Rating',
            required: false,
            min: 0,
            max: 5,
            admin: {
                step: 0.1,
            }
        }
    ],
} 