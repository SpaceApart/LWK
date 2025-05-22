---
description: Dokumentacja dla Payload CMS
globs: apps/web/src/collections/**,apps/web/src/globals/**,apps/web/src/blocks/**,apps/web/src/payload.config.ts
alwaysApply: false
---

## Importing and Initializing Payload with `getPayload` (TypeScript)

**Opis:** Illustrates how to obtain the Payload instance in contexts where it\'s not directly available via arguments, such as custom scripts or external modules. It imports the `getPayload` function and the application\'s configuration file (`@payload-config`), then calls `getPayload` asynchronously to initialize and retrieve the instance. This method supports HMR in Next.js development.

**Źródło:** https://github.com/payloadcms/payload/blob/main/docs/local-api/overview.mdx#_snippet_1

```typescript
```ts
import { getPayload } from \'payload\'
import config from \'@payload-config\'

const payload = await getPayload({ config })
```
```

---

## Defining a Simple Collection Schema in Payload (TypeScript)

**Opis:** This snippet shows how to define a basic collection configuration using Payload\'s \'CollectionConfig\' type. The example creates a \'Posts\' collection with a single \'title\' field of type \'text\'. The configuration specifies both the collection \'slug\' and \'fields\'. Required dependency: Payload types (imported via \'payload\'). Inputs: no runtime input—exported as configuration. Outputs: an exported named constant usable in the Payload config. Limitations: This is a minimal example and does not include advanced features such as access control, hooks, or authentication.

**Źródło:** https://github.com/payloadcms/payload/blob/main/docs/configuration/collections.mdx#_snippet_1

```typescript
import type { CollectionConfig } from \'payload\'

export const Posts: CollectionConfig = {
  slug: \'posts\',
  fields: [
    {
      name: \'title\',
      type: \'text\',
    },
  ],
}
```

---

## Adding a Text Field to a Payload Collection (TypeScript)

**Opis:** This code demonstrates adding a basic \'text\' field named \'field\' to the `fields` array within a Payload `CollectionConfig`. It shows a minimal field definition object containing the required `name` and `type` properties.

**Źródło:** https://github.com/payloadcms/payload/blob/main/docs/fields/overview.mdx#_snippet_1

```typescript
```ts
import type { CollectionConfig } from \'payload\'

export const Page: CollectionConfig = {
  slug: \'pages\',
  // highlight-start
  fields: [
    {
      name: \'field\',
      type: \'text\',
    },
  ],
  // highlight-end
}
```
```

---

## Registering Collections with Payload Config (TypeScript)

**Opis:** This snippet demonstrates how to register collections in the main Payload configuration using the \'buildConfig\' helper from the \'payload\' package. The \'collections\' property expects an array containing your collection schemas, allowing you to modularly structure data models. Required dependency: \'payload\' package. Ensure that each collection schema is defined according to Payload\'s conventions. Inputs: an array of collection configurations. Output: an exported Payload config object.

**Źródło:** https://github.com/payloadcms/payload/blob/main/docs/configuration/collections.mdx#_snippet_0

```typescript
import { buildConfig } from \'payload\'

export default buildConfig({
  // ...
  collections: [
    // highlight-line
    // Your Collections go here
  ],
})
```

---

## Initializing Payload Configuration with buildConfig in TypeScript

**Opis:** This snippet demonstrates the basic structure of a `payload.config.ts` file. It imports the `buildConfig` function from the \'payload\' package and exports a default configuration object created by calling this function. This file serves as the central point for defining all Payload CMS settings.

**Źródło:** https://github.com/payloadcms/payload/blob/main/docs/configuration/overview.mdx#_snippet_0

```typescript
```ts
import { buildConfig } from \'payload\'

export default buildConfig({
  // Your config goes here
})
```
```

---

## Create Minimum Payload Config (TS)

**Opis:** Provides a basic example of a `payload.config.ts` file using `buildConfig`. It includes essential configurations like the editor, collections array, secret, database adapter (MongoDB example), and optional image processing with `sharp`. This serves as a starting point for a Payload configuration.

**Źródło:** https://github.com/payloadcms/payload/blob/main/docs/getting-started/installation.mdx#_snippet_7

```TypeScript
import sharp from \'sharp\'
import { lexicalEditor } from \'@payloadcms/richtext-lexical\'
import { mongooseAdapter } from \'@payloadcms/db-mongodb\'
import { buildConfig } from \'payload\'

export default buildConfig({
  // If you\'d like to use Rich Text, pass your editor here
  editor: lexicalEditor(),

  // Define and configure your collections in this array
  collections: [],

  // Your Payload secret - should be a complex and secure string, unguessable
  secret: process.env.PAYLOAD_SECRET || \'\',
  // Whichever Database Adapter you\'re using should go here
  // Mongoose is shown as an example, but you can also use Postgres
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || \'\',
  }),
  // If you want to resize images, crop, set focal point, etc.
  // make sure to install it and pass it to the config.
  // This is optional - if you don\'t need to do these things,
  // you don\'t need it!
  sharp,
})
```

---

## Defining Fields within a Payload Collection Configuration (TypeScript)

**Opis:** This snippet illustrates the basic structure for defining fields within a Payload CMS Collection. Fields are configured within the `fields` array property of an object conforming to the `CollectionConfig` type imported from `payload`.

**Źródło:** https://github.com/payloadcms/payload/blob/main/docs/fields/overview.mdx#_snippet_0

```typescript
```ts
import type { CollectionConfig } from \'payload\'

export const Page: CollectionConfig = {
  // ...
  fields: [
    // highlight-line
    // ...
  ],
}
```
```

---

## Making an Authenticated API Request Using API Key (TypeScript)

**Opis:** This TypeScript snippet demonstrates how to authenticate a fetch request to a Payload CMS REST (or GraphQL) endpoint using an API key. The \'Authorization\' header is constructed using the collection slug, the \'API-Key\' string, and the API key value assigned to the user. Use this pattern in external applications or services to perform authenticated requests on behalf of a user with an API key; the provided API key should be securely generated and stored.

**Źródło:** https://github.com/payloadcms/payload/blob/main/docs/authentication/api-keys.mdx#_snippet_1

```TypeScript
import Users from \'../collections/Users\'

const response = await fetch(\'http://localhost:3000/api/pages\', {
  headers: {
    Authorization: `${Users.slug} API-Key ${YOUR_API_KEY}`,
  },
})
```

---

## Constructing Complex Queries with AND/OR Logic in TypeScript

**Opis:** Demonstrates combining multiple query conditions using `and` and `or` operators within the `Where` type imported from Payload. This example constructs a query to find documents where either the \'color\' is \'mint\' OR both the \'color\' is \'white\' and \'featured\' is false. Allows for deeply nested, complex filtering logic.

**Źródło:** https://github.com/payloadcms/payload/blob/main/docs/queries/overview.mdx#_snippet_1

```typescript
import type { Where } from \'payload\'

const query: Where = {
  or: [
    // highlight-line
    {
      color: {
        equals: \'mint\',
      },
    },
    {
      and: [
        // highlight-line
        {
          color: {
            equals: \'white\',
          },
        },
        {
          featured: {
            equals: false,
          },
        },
      ],
    },
  ],
}
```

---

## Initializing a New Payload Project using PNPM

**Opis:** This command utilizes `pnpx`, the package runner bundled with pnpm, to execute the `create-payload-app` scaffolding tool at its latest version. It initiates the setup process for a new Payload CMS project. Prerequisites include having Node.js and pnpm installed. The surrounding text recommends appending `-t website` for beginners to use the website template.

**Źródło:** https://github.com/payloadcms/payload/blob/main/packages/payload/README.md#_snippet_0

```text
pnpx create-payload-app@latest
```

---

## Executing Queries with the Payload Local API in TypeScript

**Opis:** Shows how to use the `payload.find` method from the Local API to query a specific collection (\'posts\'). It accepts a `where` parameter containing a query object (filtering for \'color\' equals \'mint\') to fetch matching documents directly from the database. Requires an initialized Payload instance and the `Payload` type.

**Źródło:** https://github.com/payloadcms/payload/blob/main/docs/queries/overview.mdx#_snippet_3

```typescript
import type { Payload } from \'payload\'

const getPosts = async (payload: Payload) => {
  const posts = await payload.find({
    collection: \'posts\',
    where: {
      color: {
        equals: \'mint\',
      },
    },
  })

  return posts
}
```

---

## Defining a Payload Field Type (TypeScript)

**Opis:** This snippet shows how to define a single field object using the `Field` type imported from `payload`. It specifically highlights setting the mandatory `type` property (set to \'text\' here), which determines the field\'s behavior and appearance. The `name` property is also included.

**Źródło:** https://github.com/payloadcms/payload/blob/main/docs/fields/overview.mdx#_snippet_2

```typescript
```ts
import type { Field } from \'payload\'

export const MyField: Field = {
  type: \'text\', // highlight-line
  name: \'myField\',
}
```
```

---

## Initializing PayloadCMS TypeScript Boilerplate - Bash

**Opis:** This snippet demonstrates how to initialize a new PayloadCMS project with built-in TypeScript support using the official boilerplate generator. It requires Node.js and npm installed as prerequisites. The command downloads and executes the latest version of the create-payload-app utility, prompting the user to select a project type. Inputs include user selections during setup, and the output is a ready-to-use PayloadCMS TypeScript project in the chosen directory.

**Źródło:** https://github.com/payloadcms/payload/blob/main/docs/typescript/overview.mdx#_snippet_0

```bash
npx create-payload-app@latest
```

---

## Finding Documents via Payload REST API

**Opis:** Performs a GET request to find paginated documents within a specific collection. Supports query parameters like sort, where, limit, and page for refined results. See drawer content in the original example for parameter details.

**Źródło:** https://github.com/payloadcms/payload/blob/main/docs/rest-api/overview.mdx#_snippet_0

```HTTP
GET /api/{collection-slug}
```

---

## Fetching Data with Payload Local API in a React Server Component (TSX)

**Opis:** This snippet demonstrates how to use Payload\'s Local API within a React Server Component to fetch data directly from the database. It initializes the Payload instance using the application config (`@payload-config`) and then uses the `payload.find` method to retrieve documents from the \'pages\' collection. The retrieved data (`findResult`) is fully typed, providing access to the `docs` array containing page data, along with pagination details. This method offers high performance by bypassing HTTP overhead.

**Źródło:** https://github.com/payloadcms/payload/blob/main/docs/getting-started/concepts.mdx#_snippet_0

```tsx
```tsx
import React from \'react\'
import config from \'@payload-config\'
import { getPayload } from \'payload\'

const MyServerComponent: React.FC = () => {
  const payload = await getPayload({ config })

  // The `findResult` here will be fully typed as `PaginatedDocs<Page>`,
  // where you will have the `docs` that are returned as well as
  // information about how many items are returned / are available in total / etc
  const findResult = await payload.find({ collection: \'pages\' })

  return (
    <ul>
      {findResult.docs.map((page) => {
        // Render whatever here!
        // The `page` is fully typed as your Pages collection!
      })}
    </ul>
  )
}
```
```

---

## Initializing Basic Payload CMS Configuration in TypeScript

**Opis:** This snippet demonstrates a minimal configuration for a Payload CMS application using the `buildConfig` function. It sets the application secret from an environment variable, configures the MongoDB database connection using `mongooseAdapter` with a connection URI from `process.env.DATABASE_URI`, and defines a simple \'pages\' collection with a single \'title\' text field. Requires `payload` and `@payloadcms/db-mongodb` packages, and expects `PAYLOAD_SECRET` and `DATABASE_URI` environment variables to be set.

**Źródło:** https://github.com/payloadcms/payload/blob/main/docs/configuration/overview.mdx#_snippet_1

```ts
import { buildConfig } from \'payload\'
import { mongooseAdapter } from \'@payloadcms/db-mongodb\'

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET,
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
  }),
  collections: [
    {
      slug: \'pages\',
      fields: [
        {
          name: \'title\',
          type: \'text\',
        },
      ],
    },
  ],
})
```

---

## Using the Payload App Creation CLI - Shell/Text

**Opis:** This snippet demonstrates usage patterns for the `create-payload-app` CLI tool to scaffold new Payload projects. Dependencies include npm (or yarn, pnpm) along with Node.js installed on the user\'s machine. Key parameters are the project name (`-n`), template (`-t`), and package manager options like `--use-npm`, `--use-yarn`, and `--use-pnpm`. Inputs are command-line arguments, outputs are initialized project directories with dependencies installed as specified. The tool supports both interactive and non-interactive execution, with various template choices and options for skipping dependency installation.

**Źródło:** https://github.com/payloadcms/payload/blob/main/packages/create-payload-app/README.md#_snippet_0

```text
  USAGE

      $ npx create-payload-app
      $ npx create-payload-app my-project
      $ npx create-payload-app -n my-project -t website

  OPTIONS

      -n     my-payload-app         Set project name
      -t     template_name          Choose specific template

        Available templates:

        blank                       Blank Template
        website                     Website Template
        ecommerce                   E-commerce Template
        plugin                      Template for creating a Payload plugin
        payload-demo                Payload demo site at https://demo.payloadcms.com
        payload-website             Payload website CMS at https://payloadcms.com

      --use-npm                     Use npm to install dependencies
      --use-yarn                    Use yarn to install dependencies
      --use-pnpm                    Use pnpm to install dependencies
      --no-deps                     Do not install any dependencies
      -h                            Show help
```

---

## Quickstart Payload App with create-payload-app

**Opis:** Use the create-payload-app command to quickly scaffold a new Payload application with default settings. This is the fastest way to get started.

**Źródło:** https://github.com/payloadcms/payload/blob/main/docs/getting-started/installation.mdx#_snippet_0

```bash
npx create-payload-app
```

---

## Configuring Postgres Adapter in Payload CMS with Drizzle ORM (TypeScript)

**Opis:** This snippet demonstrates how to configure the Payload CMS to use a Postgres database via the officially supported @payloadcms/db-postgres adapter. It highlights the integration using Drizzle ORM by passing a configuration object, which must include a pool with a connection string for the target Postgres instance. The adapter is provided to the db property of Payload\\\'s buildConfig. Required dependencies: @payloadcms/db-postgres, Drizzle ORM, and node-postgres. The main parameter is pool.connectionString, typically set from an environment variable. Inputs include database connection options, and the output is a configured Payload CMS instance ready to use Postgres.

**Źródło:** https://github.com/payloadcms/payload/blob/main/docs/database/postgres.mdx#_snippet_0

```typescript
import { postgresAdapter } from \'@payloadcms/db-postgres\'

export default buildConfig({
  // Configure the Postgres adapter here
  db: postgresAdapter({
    // Postgres-specific arguments go here.
    // `pool` is required.
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
})
```

---

## Defining a Payload Collection - TypeScript

**Opis:** Defines a sample collection schema for Payload CMS using TypeScript. It imports the CollectionConfig type and specifies a single required text field called \'pageTitle\'. No external code dependencies are required other than Payload\'s core types. The slug and field attributes configure how the collection is stored and rendered in Payload. Input is defined via the admin interface, output is managed by the CMS backend, with validation enforcing field requirements.

**Źródło:** https://github.com/payloadcms/payload/blob/main/docs/fields/text.mdx#_snippet_2

```typescript
import type { CollectionConfig } from \'payload\'\\n\\nexport const ExampleCollection: CollectionConfig = {\\n  slug: \'example-collection\',\\n  fields: [\\n    {\\n      name: \'pageTitle\', // required\\n      type: \'text\', // required\\n      required: true,\\n    },\\n  ],\\n}
```

---

## Example Payload Configuration with Collections - Payload CMS - TypeScript

**Opis:** This example shows a typical \'payload.config.ts\' defining collections for \'users\' and \'posts\' in a Payload CMS project. The config specifies fields and relationships used for type generation. It demonstrates how type definitions are inferred from the schema for both collections and their fields, such as required and optional attributes. The generated types can then be used throughout the codebase for type safety.

**Źródło:** https://github.com/payloadcms/payload/blob/main/docs/typescript/generating-types.mdx#_snippet_5

```typescript
import type { Config } from \'payload\'

const config: Config = {
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
  admin: {
    user: \'users\',
  },
  collections: [
    {
      slug: \'users\',
      fields: [
        {
          name: \'name\',
          type: \'text\',
          required: true,
        },
      ],
    },
    {
      slug: \'posts\',
      admin: {
        useAsTitle: \'title\',
      },
      fields: [
        {
          name: \'title\',
          type: \'text\',
        },
        {
          name: \'author\',
          type: \'relationship\',
          relationTo: \'users\',
        },
      ],
    },
  ],
}
```

---

## Setting populate Property in REST API Requests - JavaScript

**Opis:** Shows how to use the populate query string parameter in REST API calls to include specific fields from related documents, overriding any defaultPopulate rules. The example demonstrates requesting only the \'text\' field from related \'pages\' in post documents. This is a standalone JavaScript fetch call with direct query params used in the URL.

**Źródło:** https://github.com/payloadcms/payload/blob/main/docs/queries/select.mdx#_snippet_5

```javascript
fetch(\'https://localhost:3000/api/posts?populate[pages][text]=true\') // highlight-line
  .then((res) => res.json())
  .then((data) => console.log(data))
```

---

## Creating Access Control for Update Operation - Payload CMS - TypeScript

**Opis:** Configures update access in CollectionConfig to allow updates only for authenticated users. The access function inspects the \'user\' in the request and returns a boolean result. To be effective, the function should be extended for role-based or record-level restrictions.

**Źródło:** https://github.com/payloadcms/payload/blob/main/docs/access-control/collections.mdx#_snippet_5

```typescript
import type { CollectionConfig } from \'payload\'

export const CollectionWithUpdateAccess: CollectionConfig = {
  // ...
  access: {
    // highlight-start
    update: ({ req: { user } }) => {
      return Boolean(user)
    },
    // highlight-end
  },
}
```

---

## Defining a Collection with a Textarea Field - Payload CMS TypeScript

**Opis:** This TypeScript code defines a Payload CollectionConfig with a single required Textarea Field named \'metaDescription\'. The field is mandatory, and the configuration object must be exported for Payload to recognize it. This example demonstrates usage of Textarea fields as part of a collection schema. Requires \'payload\' package and is typically placed in a file in the collections directory. The field stores long-form string data per collection document.

**Źródło:** https://github.com/payloadcms/payload/blob/main/docs/fields/textarea.mdx#_snippet_2

```typescript
import type { CollectionConfig } from \'payload\'\\n\\nexport const ExampleCollection: CollectionConfig = {\\n  slug: \'example-collection\',\\n  fields: [\\n    {\\n      name: \'metaDescription\', // required\\n      type: \'textarea\', // required\\n      required: true,\\n    },\\n  ],\\n}
```

---

## Integrating useLivePreview Hook in a Client-side React Component - Payload CMS - TypeScript (TSX)

**Opis:** This snippet shows a functional React component using the \'useLivePreview\' hook from \'@payloadcms/live-preview-react\' to receive live updates for a page document. Requires installation of the specified package, a properly typed PageType, and the \'PAYLOAD_SERVER_URL\' constant. Expects initial page data as a prop, which is updated in place when admin changes occur; outputs a live-updating document title. Depth, serverURL, and initialData are required/optional properties passed to the hook. This snippet is for client components only.

**Źródło:** https://github.com/payloadcms/payload/blob/main/docs/live-preview/client.mdx#_snippet_1

```tsx
\'use client\'
import { useLivePreview } from \'@payloadcms/live-preview-react\'
import { Page as PageType } from \'@/payload-types\'

// Fetch the page in a server component, pass it to the client component, then thread it through the hook
// The hook will take over from there and keep the preview in sync with the changes you make
// The `data` property will contain the live data of the document
export const PageClient: React.FC<{
  page: {
    title: string
  }
}> = ({ page: initialPage }) => {
  const { data } = useLivePreview<PageType>({
    initialData: initialPage,
    serverURL: PAYLOAD_SERVER_URL,
    depth: 2,
  })

  return <h1>{data.title}</h1>
}
```

---

## Starting Development Server (Shell)

**Opis:** These shell commands are used to start the Payload development server, depending on the package manager used (pnpm, yarn, or npm). The specific command invokes the \'dev\' script defined in the project\'s `package.json`.

**Źródło:** https://github.com/payloadcms/payload/blob/main/examples/custom-components/README.md#_snippet_1

```shell
pnpm dev
```

```shell
yarn dev
```

```shell
npm run dev
```

---

## Querying a Payload Collection via REST API using Fetch (TypeScript)

**Opis:** This example demonstrates fetching data from a Payload collection named \'pages\' using the built-in REST API. It utilizes the standard `fetch` API to make an HTTP GET request to the `/api/pages` endpoint of a running Payload application (assumed to be at `https://localhost:3000`). The response is then parsed as JSON, and the resulting data is logged to the console. This is a standard way to interact with Payload from client-side applications or external services.

**Źródło:** https://github.com/payloadcms/payload/blob/main/docs/getting-started/concepts.mdx#_snippet_1

```typescript
```ts
fetch(\'https://localhost:3000/api/pages\') // highlight-line
  .then((res) => res.json())
  .then((data) => console.log(data))
```
```

---

## Illustrating Payload Project Structure in Next.js (Plaintext)

**Opis:** Displays the directory layout generated by Payload within a Next.js application\'s `app` directory. It shows the `(payload)` route group containing subdirectories for the admin UI (`admin`), REST API (`api`), GraphQL API (`graphql`), GraphQL Playground (`graphql-playground`), custom styles (`custom.scss`), and the group\'s layout file (`layout.tsx`). This structure isolates Payload functionality using Next.js conventions.

**Źródło:** https://github.com/payloadcms/payload/blob/main/docs/admin/overview.mdx#_snippet_0

```plaintext
app/
├─ (payload)/
├── admin/
├─── [[...segments]]/
├──── page.tsx
├──── not-found.tsx
├── api/
├─── [...slug]/
├──── route.ts
├── graphql/
├──── route.ts
├── graphql-playground/
├──── route.ts
├── custom.scss
├── layout.tsx
```

---

## Configuring Operation-specific Access Control - Payload CMS - TypeScript

**Opis:** Demonstrates detailed setup of the `access` property inside a Global Config, assigning access control functions to `read`, `update`, and optionally `readVersion` for versioned Globals. Requires Payload CMS, and expects access control functions that evaluate permissions based on the authenticated `user` object in the request. Suitable for securing operations with custom logic.

**Źródło:** https://github.com/payloadcms/payload/blob/main/docs/access-control/globals.mdx#_snippet_1

```TypeScript
import { GlobalConfig } from \'payload\'

const GlobalWithAccessControl: GlobalConfig = {
  // ...
  // highlight-start
  access: {
    read: ({ req: { user } }) => {...},
    update: ({ req: { user } }) => {...},

    // Version-enabled Globals only
    readVersion: () => {...},
  },
  // highlight-end
}

export default Header
```

---

## Setting Dynamic Live Preview URL Function in Payload Config

**Opis:** This snippet illustrates how to configure a dynamic URL for Live Preview in Payload CMS by providing a function to the `url` property. This function receives arguments like `data`, `collectionConfig`, and `locale`, allowing URL generation based on the document being edited, useful for multi-tenant or localized applications.

**Źródło:** https://github.com/payloadcms/payload/blob/main/docs/live-preview/overview.mdx#_snippet_2

```typescript
import { buildConfig } from \'payload\'

const config = buildConfig({
  // ...
  admin: {
    // ...
    livePreview: {
      // highlight-start
      url: ({
        data,
        collectionConfig,
        locale
      }) => `${data.tenant.url}${ // Multi-tenant top-level domain
        collectionConfig.slug === \'posts\' ? `/posts/${data.slug}` : `${data.slug !== \'home\' ? `/${data.slug}` : \'\'}`
      }${locale ? `?locale=${locale?.code}` : \'\'}`, // Localization query param
      collections: [\'pages\'],
    },
    // highlight-end
  }
})
```

---

## Configuring a Media Collection with Uploads in Payload CMS using TypeScript

**Opis:** This TypeScript code defines a Payload CMS Collection configuration named \'Media\'. It enables the upload functionality by setting the `upload` property, specifying the static directory (\'media\'), defining multiple image sizes (\'thumbnail\', \'card\', \'tablet\') for automatic resizing, setting the admin panel thumbnail size, and restricting allowed mime types to images (\'image/*\'). An additional \'alt\' text field is also defined for the collection.

**Źródło:** https://github.com/payloadcms/payload/blob/main/docs/upload/overview.mdx#_snippet_0

```typescript
```ts
import type { CollectionConfig } from \'payload\'

export const Media: CollectionConfig = {
  slug: \'media\',
  upload: {
    staticDir: \'media\',
    imageSizes: [
      {
        name: \'thumbnail\',
        width: 400,
        height: 300,
        position: \'centre\',
      },
      {
        name: \'card\',
        width: 768,
        height: 1024,
        position: \'centre\',
      },
      {
        name: \'tablet\',
        width: 1024,
        // By specifying `undefined` or leaving a height undefined,
        // the image will be sized to a certain width,
        // but it will retain its original aspect ratio
        // and calculate a height automatically.
        height: undefined,
        position: \'centre\',
      },
    ],
    adminThumbnail: \'thumbnail\',
    mimeTypes: [\'image/*\'],
  },
  fields: [
    {
      name: \'alt\',
      type: \'text\',
    },
  ],
}
```
```

---

## Generating Types via CLI - Payload CMS - Shell/Command

**Opis:** This command runs the Payload CMS TypeScript type generator, creating strongly-typed interfaces based on the current Payload configuration file (usually payload.config.ts). It should be run whenever the schema changes to keep types up-to-date. The generated types can be imported in your TypeScript code for improved type safety.

**Źródło:** https://github.com/payloadcms/payload/blob/main/docs/typescript/generating-types.mdx#_snippet_0

```shell
payload generate:types
```

---

## Defining Custom Endpoints within a Payload CollectionConfig in TypeScript

**Opis:** Demonstrates configuring custom REST endpoints (`GET`, `POST`) within a Payload CMS `CollectionConfig` for an \'orders\' collection. Includes examples for handling route parameters (`req.routeParams.id`), reading request bodies (`req.json()`), using the internal Payload API (`req.payload.update`), returning JSON responses, and implementing basic authentication checks (`req.user`). Note that custom endpoints are not authenticated by default.

**Źródło:** https://github.com/payloadcms/payload/blob/main/docs/rest-api/overview.mdx#_snippet_11

```typescript
```ts
import type { CollectionConfig } from \'payload\'

// a collection of \'orders\' with an additional route for tracking details, reachable at /api/orders/:id/tracking
export const Orders: CollectionConfig = {
  slug: \'orders\',
  fields: [
    /* ... */
  ],
  // highlight-start
  endpoints: [
    {
      path: \'/:id/tracking\',
      method: \'get\',
      handler: async (req) => {
        const tracking = await getTrackingInfo(req.routeParams.id)

        if (!tracking) {
          return Response.json({ error: \'not found\' }, { status: 404 })
        }

        return Response.json({
          message: `Hello ${req.routeParams.name as string} @ ${req.routeParams.group as string}`,
        })
      },
    },
    {
      path: \'/:id/tracking\',
      method: \'post\',
      handler: async (req) => {
        // `data` is not automatically appended to the request
        // if you would like to read the body of the request
        // you can use `data = await req.json()`
        const data = await req.json()
        await req.payload.update({
          collection: \'tracking\',
          data: {
            // data to update the document with
          },
        })
        return Response.json({
          message: \'successfully updated tracking info\',
        })
      },
    },
    {
      path: \'/:id/forbidden\',
      method: \'post\',
      handler: async (req) => {
        // this is an example of an authenticated endpoint
        if (!req.user) {
          return Response.json({ error: \'forbidden\' }, { status: 403 })
        }

        // do something

        return Response.json({
          message: \'successfully updated tracking info\',
        })
      },
    },
  ],
  // highlight-end
}
```
```

---

## Adding Supported Languages to Payload CMS i18n Configuration

**Opis:** Illustrates how to add multiple supported languages to the Payload CMS application. It involves importing language-specific translation objects (e.g., `en`, `de`) from `@payloadcms/translations` and assigning them to the `i18n.supportedLanguages` key in the `payload.config.ts` file.

**Źródło:** https://github.com/payloadcms/payload/blob/main/docs/configuration/i18n.mdx#_snippet_3

```typescript
import { buildConfig } from \'payload\'
import { en } from \'@payloadcms/translations/languages/en\'
import { de } from \'@payloadcms/translations/languages/de\'

export default buildConfig({
  // ...
  // highlight-start
  i18n: {
    supportedLanguages: { en, de },
  },
  // highlight-end
})
```

---

## Defining a Basic Query Filter in TypeScript

**Opis:** Imports the `Where` type from Payload and defines a simple query object. This query filters for documents where the \'color\' field is exactly equal to \'blue\'. This structure is fundamental for filtering data across different Payload APIs.

**Źródło:** https://github.com/payloadcms/payload/blob/main/docs/queries/overview.mdx#_snippet_0

```typescript
import type { Where } from \'payload\'

const query: Where = {
  color: {
    equals: \'blue\',
  },
}
```

---

## Configuring Lexical Editor in Payload CMS - TypeScript

**Opis:** This TypeScript snippet illustrates how to integrate the Lexical Rich Text Editor with a Payload CMS configuration. It imports the necessary functions from the \'payload\' and \'@payloadcms/richtext-lexical\' packages, then defines a configuration object that sets \'editor\' to the result of lexicalEditor({}). Key parameters include the imported editor object, and you can customize the rest of the Payload config as needed. Expected output is a Payload CMS config exporting the Lexical editor as the content editor. Requires both \'payload\' and \'@payloadcms/richtext-lexical\' to be installed. This setup should be included in the main Payload config file.

**Źródło:** https://github.com/payloadcms/payload/blob/main/packages/richtext-lexical/README.md#_snippet_1

```typescript
import { buildConfig } from \'payload\'
import { lexicalEditor } from \'@payloadcms/richtext-lexical\'

export default buildConfig({
  editor: lexicalEditor({}),
  // ...rest of config
})
```

---

## Preventing Infinite Loops in Payload `afterChange` Hook using Context (TypeScript)

**Opis:** Shows the correct way to update a document within its own `afterChange` hook by using the `context` object. A flag (`triggerAfterChange`) is checked at the start of the hook and set to `false` when calling `req.payload.update` via its `context` option, preventing subsequent recursive executions.

**Źródło:** https://github.com/payloadcms/payload/blob/main/docs/hooks/context.mdx#_snippet_2

```typescript
import type { CollectionConfig } from \'payload\'

const MyCollection: CollectionConfig = {
  slug: \'slug\',
  hooks: {
    afterChange: [
      async ({ context, doc, req }) => {
        // return if flag was previously set
        if (context.triggerAfterChange === false) {
          return
        }
        await req.payload.update({
          collection: contextHooksSlug,
          id: doc.id,
          data: {
            ...(await fetchCustomerData(data.customerID)),
          },
          context: {
            // set a flag to prevent from running again
            triggerAfterChange: false,
          },
        })
      },
    ],
  },
  fields: [
    /* ... */
  ],
}
```

---

## Running the Development Server with pnpm - Shell

**Opis:** This shell command starts the PayloadCMS development server using pnpm, typically invoking a custom or predefined dev script. It initializes hot-reloading and local hosting. Project dependencies must first be installed. Expected output is a running development server accessible via localhost in a web browser.

**Źródło:** https://github.com/payloadcms/payload/blob/main/examples/localization/README.md#_snippet_3

```shell
pnpm run dev
```

---

## Creating Access Control for Read Operation - Payload CMS - TypeScript

**Opis:** Defines a read access function in a CollectionConfig, granting document access if \'user\' is authenticated. The logic receives a \'req\' object with a \'user\' property and returns a boolean. This snippet assumes an authenticated request context and is suitable for scenarios where only logged-in users should read documents.

**Źródło:** https://github.com/payloadcms/payload/blob/main/docs/access-control/collections.mdx#_snippet_3

```typescript
import type { CollectionConfig } from \'payload\'

export const CollectionWithReadAccess: CollectionConfig = {
  // ...
  access: {
    // highlight-start
    read: ({ req: { user } }) => {
      return Boolean(user)
    },
    // highlight-end
  },
}
```

---

## Defining a Typed SEO Title Generation Function in TypeScript

**Opis:** This example illustrates how to use the imported `GenerateTitle` type from `@payloadcms/plugin-seo/types` in conjunction with generated Payload types (like `Page` from `./payload-types.ts`). It shows the definition of a type-safe asynchronous function `generateTitle` that takes the document (`doc`) and locale as input and returns a custom title string based on the document\'s data.

**Źródło:** https://github.com/payloadcms/payload/blob/main/docs/plugins/seo.mdx#_snippet_10

```ts
import type { Page } from \'./payload-types.ts\'

import type { GenerateTitle } from \'@payloadcms/plugin-seo/types\'

const generateTitle: GenerateTitle<Page> = async ({ doc, locale }) => {
  return `Website.com — ${doc?.title}`
}
```

---

## Retrieving Payload Admin Client Config with useConfig in React (TypeScript)

**Opis:** Illustrates how to use useConfig from @payloadcms/ui to access the Payload CMS admin configuration within a React component. The config object contains global settings like the serverURL, and this pattern is suitable for UI display or logic that needs config context. Requires @payloadcms/ui and appropriate admin UI context.

**Źródło:** https://github.com/payloadcms/payload/blob/main/docs/admin/react-hooks.mdx#_snippet_14

```tsx
\'use client\'\\nimport { useConfig } from \'@payloadcms/ui\'\\n\\nconst MyComponent: React.FC = () => {\\n  // highlight-start\\n  const { config } = useConfig()\\n  // highlight-end\\n\\n  return <span>{config.serverURL}</span>\\n}
```

---

## Inserting Documents into Collections - Payload CMS JavaScript

**Opis:** This code creates a new document in a specified collection using the Payload Local API. It showcases support for locales, user assignment, access overrides, hidden fields, file uploads (by file path or File object), and the duplication of existing documents. The snippet also demonstrates overrides related to authentication and upload-specific options. Payload and node path module must be available, and required parameters include collection and data.

**Źródło:** https://github.com/payloadcms/payload/blob/main/docs/local-api/overview.mdx#_snippet_3

```JavaScript
// The created Post document is returned
const post = await payload.create({
  collection: \'posts\', // required
  data: {
    // required
    title: \'sure\',
    description: \'maybe\',
  },
  locale: \'en\',
  fallbackLocale: false,
  user: dummyUserDoc,
  overrideAccess: true,
  showHiddenFields: false,

  // If creating verification-enabled auth doc,
  // you can optionally disable the email that is auto-sent
  disableVerificationEmail: true,

  // If your collection supports uploads, you can upload
  // a file directly through the Local API by providing
  // its full, absolute file path.
  filePath: path.resolve(__dirname, \'./path-to-image.jpg\'),

  // Alternatively, you can directly pass a File,
  // if file is provided, filePath will be omitted
  file: uploadedFile,

  // If you want to create a document that is a duplicate of another document
  duplicateFromID: \'document-id-to-duplicate\',
})
```

---

## Defining Field-Level Access Control Rules in a Collection (PayloadCMS, TypeScript)

**Opis:** This snippet defines a \'Posts\' collection in PayloadCMS and demonstrates how to add field-level access controls using the "access" property. Callback functions for create, read, and update are assigned, allowing developers to insert logic that controls per-operation permissions based on the request context and user. Requires the \'payload\' library, with types imported from \'payload\', and should be placed within the configuration section for a registered collection.

**Źródło:** https://github.com/payloadcms/payload/blob/main/docs/access-control/fields.mdx#_snippet_1

```typescript
import type { CollectionConfig } from \'payload\';

export const Posts: CollectionConfig = {
  slug: \'posts\',
  fields: [
    {
      name: \'title\',
      type: \'text\',
      // highlight-start
      access: {
        create: ({ req: { user } }) => { ... },
        read: ({ req: { user } }) => { ... },
        update: ({ req: { user } }) => { ... },
      },
      // highlight-end
    };
  ],
};
```

</rewritten_file> 