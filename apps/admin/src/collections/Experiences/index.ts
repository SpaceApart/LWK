import type { CollectionConfig } from 'payload';
import { authenticated } from '../../access/authenticated';
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished';

export const Experiences: CollectionConfig = {
    slug: 'experiences',
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
        group: 'Tourism',
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
                                date: {
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
                                date: {
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
            name: 'workflowStatus',
            type: 'select',
            options: [
                { label: 'Draft', value: 'draft' },
                { label: 'Pending Review', value: 'pending_review' },
                { label: 'Published', value: 'published' },
                { label: 'Rejected', value: 'rejected' },
            ],
            defaultValue: 'draft',
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'workflowMetadata',
            type: 'group',
            label: 'Workflow Information',
            admin: {
                position: 'sidebar',
                condition: (data) => data?.workflowStatus !== 'draft',
            },
            fields: [
                {
                    name: 'submittedBy',
                    type: 'relationship',
                    relationTo: 'users',
                    admin: {
                        readOnly: true,
                    },
                },
                {
                    name: 'submittedAt',
                    type: 'date',
                    admin: {
                        readOnly: true,
                    },
                },
                {
                    name: 'reviewedBy',
                    type: 'relationship',
                    relationTo: 'users',
                    admin: {
                        readOnly: true,
                    },
                },
                {
                    name: 'reviewedAt',
                    type: 'date',
                    admin: {
                        readOnly: true,
                    },
                },
                {
                    name: 'rejectionReason',
                    type: 'textarea',
                    admin: {
                        condition: (data) => data?.workflowStatus === 'rejected',
                    },
                },
            ],
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