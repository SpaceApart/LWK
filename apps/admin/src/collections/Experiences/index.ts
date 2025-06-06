import type { CollectionConfig } from 'payload';
import { authenticated } from '../../access/authenticated';
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished';

export const Experiences: CollectionConfig = {
    slug: 'experiences',
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
            name: 'price_from',
            type: 'number',
            label: 'Price From',
            required: false,
            localized: false,
            admin: {
                step: 0.01, // Krok dla cen np. 25.50
            }
        },
        {
            name: 'price_to',
            type: 'number',
            label: 'Price To',
            required: false,
            localized: false,
            admin: {
                step: 0.01,
            }
        },
        {
            name: 'available_dates',
            type: 'array',
            label: 'Available Dates (Optional)',
            required: false,
            localized: false,
            fields: [
                {
                    name: 'date_range',
                    type: 'group',
                    label: 'Date Range',
                    fields: [
                        {
                            name: 'start_date',
                            type: 'date',
                            label: 'Start Date',
                            required: true,
                            admin: {
                                datePicker: {
                                    displayFormat: 'yyyy-MM-dd',
                                }
                            }
                        },
                        {
                            name: 'end_date',
                            type: 'date',
                            label: 'End Date',
                            required: true,
                            admin: {
                                datePicker: {
                                    displayFormat: 'yyyy-MM-dd',
                                }
                            }
                        },
                    ]
                }
            ]
        },
        {
            name: 'contact',
            type: 'group',
            label: 'Contact Information',
            localized: false,
            fields: [
                {
                    name: 'phone',
                    type: 'text',
                    label: 'Phone Number',
                },
                {
                    name: 'email',
                    type: 'email',
                    label: 'Email Address',
                },
                {
                    name: 'website',
                    type: 'text',
                    label: 'Website URL',
                    validate: (val: string | undefined) => {
                        if (val && !val.startsWith('http')) {
                            return 'Please enter a valid URL (e.g., http://example.com)';
                        }
                        return true;
                    }
                },
            ]
        },
        {
            name: 'images',
            type: 'array',
            label: 'Images',
            minRows: 0, // Pozwalam na brak obrazów, jeśli są opcjonalne
            required: false,
            localized: true, // Kolejność/wybór obrazów może być lokalizowany
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