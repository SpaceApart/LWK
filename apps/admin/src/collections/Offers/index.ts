import type { CollectionConfig } from 'payload';
import { authenticated } from '../../access/authenticated';
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished';

export const Offers: CollectionConfig = {
    slug: 'offers',
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
            autosave: true, // Enable autosave for drafts
        },
        maxPerDoc: 10, // Limit number of versions per document
    },
    // localization: true, // localization is handled by payload.config.ts and localized:true on fields
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
            localized: true, // Title should be localizable
        },
        {
            name: 'slug',
            type: 'text',
            index: true,
            required: true,
            localized: true, // Slug might need to be localizable
            admin: {
                position: 'sidebar',
            },
            // Simple slug field for now, can be enhanced with slugField utility later
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
            name: 'location',
            type: 'relationship',
            relationTo: 'locations',
            required: true,
            localized: true, // Oferta w PL może być w innej lokalizacji niż oferta w EN (teoretycznie)
        },
        {
            name: 'floor',
            type: 'number',
            required: false,
            localized: false,
        },
        {
            name: 'amenities',
            type: 'array',
            label: 'Amenities',
            localized: true,
            fields: [
                {
                    name: 'amenity_name',
                    type: 'text',
                    label: 'Amenity Name',
                    required: true,
                    localized: true, // Nazwa udogodnienia może być tłumaczona
                },
            ],
        },
        {
            name: 'tags',
            type: 'relationship',
            relationTo: 'tags',
            hasMany: true,
            localized: true, // Zestaw tagów może być różny per język
        },
        {
            name: 'beds_single',
            type: 'number',
            label: 'Single Beds',
            required: false,
            localized: false,
            admin: {
                step: 1,
            }
        },
        {
            name: 'extra_beds',
            type: 'number',
            label: 'Extra Beds',
            required: false,
            localized: false,
            admin: {
                step: 1,
            }
        },
        {
            name: 'rating_avg',
            type: 'number',
            label: 'Average Rating (Calculated or Manual)',
            required: false,
            localized: false,
            admin: {
                step: 0.1,
            }
        },
        {
            name: 'host_rating',
            type: 'number',
            label: 'Host Rating (Optional)',
            required: false,
            localized: false,
            admin: {
                step: 0.1,
            }
        },
        {
            name: 'images',
            type: 'array',
            label: 'Images',
            minRows: 1, // Przynajmniej jedno zdjęcie oferty
            required: true,
            localized: true, // Kolejność/wybór zdjęć
            fields: [
                {
                    name: 'image',
                    type: 'upload',
                    relationTo: 'media',
                    required: true,
                },
            ],
        }
    ],
} 