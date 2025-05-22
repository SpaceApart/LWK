---
description: Dokumentacja dla Clerk
globs: apps/dashboard/src/features/auth/**,apps/dashboard/src/app/auth/**
alwaysApply: false
---

## Importing and Using ClerkProvider for Authentication Context

**Opis:** The ClerkProvider component serves as a context provider that makes authentication data accessible throughout the application. It should be implemented at the root of your application to provide global access to user session data and authentication state.

**Źródło:** https://github.com/clerk/clerk-docs/blob/main/docs/_partials/clerk-provider/explanation.mdx#2025-04-23_snippet_0

```jsx
<ClerkProvider>
```

---

## Configuring Clerk API Keys in .env File (Shell)

**Opis:** Example structure for a `.env` file to store Clerk API keys. The `CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` are essential environment variables required by the Clerk SDK to authenticate requests with the Clerk API. These keys should be retrieved from the Clerk Dashboard.

**Źródło:** https://github.com/clerk/clerk-docs/blob/main/docs/quickstarts/express.mdx#2025-04-23_snippet_1

```sh
CLERK_PUBLISHABLE_KEY={{pub_key}}
CLERK_SECRET_KEY={{secret}}
```

---

## Setting Clerk Publishable Key (Environment Variable)

**Opis:** Defines the Clerk Publishable Key as an environment variable within a `.env` file. This key is required by the Clerk SDK to identify your application and connect to the Clerk API. The key should be prefixed with `EXPO_PUBLIC_` to be accessible in the Expo client-side code.

**Źródło:** https://github.com/clerk/clerk-docs/blob/main/docs/quickstarts/expo.mdx#2025-04-23_snippet_1

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY={{pub_key}}
```

---

## Implementing Admin Dashboard with User Search and Role Management in Next.js (TypeScript)

**Opis:** This Next.js page component (`AdminDashboard`) defines the admin interface. It first verifies the user has the 'admin' role using `checkRole` and redirects if not. It retrieves the search query from URL parameters and uses `clerkClient.users.getUserList` to fetch matching users if a query exists. The component then renders the `SearchUsers` component and maps over the fetched users, displaying their name, email, and current role. For each user, it provides forms with buttons ('Make Admin', 'Make Moderator', 'Remove Role') that submit the user ID and target role/action to the imported `setRole` and `removeRole` server actions.

**Źródło:** https://github.com/clerk/clerk-docs/blob/main/docs/references/nextjs/basic-rbac.mdx#2025-04-23_snippet_9

```tsx
import { redirect } from \'next/navigation\'
import { checkRole } from \'@/utils/roles\'
import { SearchUsers } from \'./SearchUsers\'
import { clerkClient } from \'@clerk/nextjs/server\'
import { removeRole, setRole } from \'./_actions\'

export default async function AdminDashboard(params: {
  searchParams: Promise<{ search?: string }>\
}) {
  if (!checkRole(\'admin\')) {
    redirect(\'/\')
  }

  const query = (await params.searchParams).search

  const client = await clerkClient()

  const users = query ? (await client.users.getUserList({ query })).data : []

  return (
    <>
      <p>This is the protected admin dashboard restricted to users with the `admin` role.</p>

      <SearchUsers />

      {users.map((user) => {
        return (
          <div key={user.id}>
            <div>
              {user.firstName} {user.lastName}
            </div>

            <div>
              {
                user.emailAddresses.find((email) => email.id === user.primaryEmailAddressId)
                  ?.emailAddress
              }
            </div>

            <div>{user.publicMetadata.role as string}</div>

            <form action={setRole}>
              <input type="hidden" value={user.id} name="id" />
              <input type="hidden" value="admin" name="role" />
              <button type="submit">Make Admin</button>
            </form>

            <form action={setRole}>
              <input type="hidden" value={user.id} name="id" />
              <input type="hidden" value="moderator" name="role" />
              <button type="submit">Make Moderator</button>
            </form>

            <form action={removeRole}>
              <input type="hidden" value={user.id} name="id" />
              <button type="submit">Remove Role</button>
            </form>
          </div>
        )
      })}
    </>
  )
}
```

---

## Implementing Clerk Authentication in a GET Request Handler (TypeScript)

**Opis:** This snippet demonstrates how to create a Clerk client, authenticate a request, and handle the authentication result in a GET request handler. It uses environment variables for Clerk credentials and includes logic for both authenticated and unauthenticated requests.

**Źródło:** https://github.com/clerk/clerk-docs/blob/main/docs/_partials/authenticate-req.mdx#2025-04-23_snippet_0

```tsx
import { createClerkClient } from \'@clerk/backend\'

export async function GET(req: Request) {
  const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  })

  const { isSignedIn } = await clerkClient.authenticateRequest(req, {
    jwtKey: process.env.CLERK_JWT_KEY,
    authorizedParties: [\'https://example.com\'],
  })

  if (!isSignedIn) {
    return Response.json({ status: 401 })
  }

  // Add logic to perform protected actions

  return Response.json({ message: \'This is a reply\' })
}
```

---

## Implementing MFA Sign-In Flow in React Native (Expo) with Clerk

**Opis:** This TSX component implements a multi-factor sign-in screen for a React Native application using Expo and Clerk. It utilizes the `useSignIn` hook to manage the sign-in process. The component first presents fields for email and password (`handleFirstStage`). If the initial sign-in attempt requires a second factor (`needs_second_factor`), it displays a form for entering a TOTP or backup code (`onPressTOTP`), including a checkbox to specify if a backup code is being used. Upon successful completion, it sets the active session and navigates the user.

**Źródło:** https://github.com/clerk/clerk-docs/blob/main/docs/custom-flows/email-password-mfa.mdx#2025-04-23_snippet_9

```tsx
import React from \'react\'
import { useSignIn } from \'@clerk/clerk-expo\'
import { useRouter } from \'expo-router\'
import { Text, TextInput, Button, View } from \'react-native\'
import Checkbox from \'expo-checkbox\'

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()

  const [email, setEmail] = React.useState(\'\')
  const [password, setPassword] = React.useState(\'\')
  const [code, setCode] = React.useState(\'\')
  const [useBackupCode, setUseBackupCode] = React.useState(false)
  const [displayTOTP, setDisplayTOTP] = React.useState(false)
  const router = useRouter()

  // Handle user submitting email and pass and swapping to TOTP form
  const handleFirstStage = async () => {
    if (!isLoaded) return

    // Attempt to sign in using the email and password provided
    try {
      const attemptFirstFactor = await signIn.create({
        identifier: email,
        password,
      })

      // If the sign-in was successful, set the session to active
      // and redirect the user
      if (attemptFirstFactor.status === \'complete\') {
        await setActive({ session: attemptFirstFactor.createdSessionId })
        router.replace(\'/\')
      } else if (attemptFirstFactor.status === \'needs_second_factor\') {
        // If the sign-in requires a second factor, display the TOTP form
        setDisplayTOTP(true)
      } else {
        // If the sign-in failed, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(attemptFirstFactor, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  // Handle the submission of the TOTP or backup code
  const onPressTOTP = React.useCallback(async () => {
    if (!isLoaded) return

    try {
      // Attempt the TOTP or backup code verification
      const attemptSecondFactor = await signIn.attemptSecondFactor({
        strategy: useBackupCode ? \'backup_code\' : \'totp\',
        code: code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (attemptSecondFactor.status === \'complete\') {
        await setActive({ session: attemptSecondFactor.createdSessionId })

        router.replace(\'/\')
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(attemptSecondFactor, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }, [isLoaded, email, password, code, useBackupCode])

  if (displayTOTP) {
    return (
      <View>
        <Text>Verify your account</Text>

        <View>
          <TextInput
            value={code}
            placeholder="Enter the code"
            placeholderTextColor="#666666"
            onChangeText={(c) => setCode(c)}
          />
        </View>
        <View style={{ flexDirection: \'row\', alignItems: \'center\', gap: 5 }}>
          <Text>Check if this code is a backup code</Text>
          <Checkbox value={useBackupCode} onValueChange={() => setUseBackupCode((prev) => !prev)} />
        </View>
        <Button title="Verify" onPress={onPressTOTP} />
      </View>
    )
  }

  return (
    <View>
      <Text>Sign in</Text>
      <View>
        <TextInput
          value={email}
          placeholder="Enter email"
          placeholderTextColor="#666666"
          onChangeText={(email) => setEmail(email)}
        />
      </View>

      <View>
        <TextInput
          value={password}
          placeholder="Enter password"
          placeholderTextColor="#666666"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
      </View>

      <Button title="Continue" onPress={handleFirstStage} />
    </View>
  )
}
```

---

## Implementing Clerk Sign-in Page with shadcn UI in Next.js

**Opis:** A complete sign-in page implementation using Clerk Elements with shadcn UI components. The implementation includes three main steps: initial sign-in form with social providers, authentication strategy selection, and verification methods (password and email code). It also features loading states and error handling.

**Źródło:** https://github.com/clerk/clerk-docs/blob/main/docs/customization/elements/examples/shadcn-ui.mdx#2025-04-23_snippet_4

```tsx
\'use client\'
import * as Clerk from \'@clerk/elements/common\'
import * as SignIn from \'@clerk/elements/sign-in\'
import { Button } from \'@/components/ui/button\'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from \'@/components/ui/card\'
import { Input } from \'@/components/ui/input\'
import { Label } from \'@/components/ui/label\'
import { Icons } from \'@/components/ui/icons\'

export default function SignInPage() {
  return (
    <div className="grid w-full grow items-center px-4 sm:justify-center">
      <SignIn.Root>
        <Clerk.Loading>
          {(isGlobalLoading) => (
            <>
              <SignIn.Step name="start">
                <Card className="w-full sm:w-96">
                  <CardHeader>
                    <CardTitle>Sign in to Acme Co</CardTitle>
                    <CardDescription>Welcome back! Please sign in to continue</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-y-4">
                    <div className="grid grid-cols-2 gap-x-4">
                      <Clerk.Connection name="github" asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          type="button"
                          disabled={isGlobalLoading}
                        >
                          <Clerk.Loading scope="provider:github">
                            {(isLoading) =>
                              isLoading ? (
                                <Icons.spinner className="size-4 animate-spin" />
                              ) : (
                                <>
                                  <Icons.gitHub className="mr-2 size-4" />
                                  GitHub
                                </>
                              )
                            }
                          </Clerk.Loading>
                        </Button>
                      </Clerk.Connection>
                      <Clerk.Connection name="google" asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          type="button"
                          disabled={isGlobalLoading}
                        >
                          <Clerk.Loading scope="provider:google">
                            {(isLoading) =>
                              isLoading ? (
                                <Icons.spinner className="size-4 animate-spin" />
                              ) : (
                                <>
                                  <Icons.google className="mr-2 size-4" />
                                  Google
                                </>
                              )
                            }
                          </Clerk.Loading>
                        </Button>
                      </Clerk.Connection>
                    </div>
                    <p className="flex items-center gap-x-3 text-sm text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
                      or
                    </p>
                    <Clerk.Field name="identifier" className="space-y-2">
                      <Clerk.Label asChild>
                        <Label>Email address</Label>
                      </Clerk.Label>
                      <Clerk.Input type="email" required asChild>
                        <Input />
                      </Clerk.Input>
                      <Clerk.FieldError className="block text-sm text-destructive" />
                    </Clerk.Field>
                  </CardContent>
                  <CardFooter>
                    <div className="grid w-full gap-y-4">
                      <SignIn.Action submit asChild>
                        <Button disabled={isGlobalLoading}>
                          <Clerk.Loading>
                            {(isLoading) => {
                              return isLoading ? (
                                <Icons.spinner className="size-4 animate-spin" />
                              ) : (
                                \'Continue\'
                              )
                            }}
                          </Clerk.Loading>
                        </Button>
                      </SignIn.Action>

                      <Button variant="link" size="sm" asChild>
                        <Clerk.Link navigate="sign-up">
                          Don&apos;t have an account? Sign up
                        </Clerk.Link>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </SignIn.Step>

              <SignIn.Step name="choose-strategy">
                <Card className="w-full sm:w-96">
                  <CardHeader>
                    <CardTitle>Use another method</CardTitle>
                    <CardDescription>
                      Facing issues? You can use any of these methods to sign in.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-y-4">
                    <SignIn.SupportedStrategy name="email_code" asChild>
                      <Button type="button" variant="link" disabled={isGlobalLoading}>
                        Email code
                      </Button>
                    </SignIn.SupportedStrategy>
                    <SignIn.SupportedStrategy name="password" asChild>
                      <Button type="button" variant="link" disabled={isGlobalLoading}>
                        Password
                      </Button>
                    </SignIn.SupportedStrategy>
                  </CardContent>
                  <CardFooter>
                    <div className="grid w-full gap-y-4">
                      <SignIn.Action navigate="previous" asChild>
                        <Button disabled={isGlobalLoading}>
                          <Clerk.Loading>
                            {(isLoading) => {
                              return isLoading ? (
                                <Icons.spinner className="size-4 animate-spin" />
                              ) : (
                                \'Go back\'
                              )
                            }}
                          </Clerk.Loading>
                        </Button>
                      </SignIn.Action>
                    </div>
                  </CardFooter>
                </Card>
              </SignIn.Step>

              <SignIn.Step name="verifications">
                <SignIn.Strategy name="password">
                  <Card className="w-full sm:w-96">
                    <CardHeader>
                      <CardTitle>Check your email</CardTitle>
                      <CardDescription>
                        Enter the verification code sent to your email
                      </CardDescription>
                      <p className="text-sm text-muted-foreground">
                        Welcome back <SignIn.SafeIdentifier />
                      </p>
                    </CardHeader>
                    <CardContent className="grid gap-y-4">
                      <Clerk.Field name="password" className="space-y-2">
                        <Clerk.Label asChild>
                          <Label>Password</Label>
                        </Clerk.Label>
                        <Clerk.Input type="password" asChild>
                          <Input />
                        </Clerk.Input>
                        <Clerk.FieldError className="block text-sm text-destructive" />
                      </Clerk.Field>
                    </CardContent>
                    <CardFooter>
                      <div className="grid w-full gap-y-4">
                        <SignIn.Action submit asChild>
                          <Button disabled={isGlobalLoading}>
                            <Clerk.Loading>
                              {(isLoading) => {
                                return isLoading ? (
                                  <Icons.spinner className="size-4 animate-spin" />
                                ) : (
                                  \'Continue\'
                                )
                              }}
                            </Clerk.Loading>
                          </Button>
                        </SignIn.Action>
                        <SignIn.Action navigate="choose-strategy" asChild>
                          <Button type="button" size="sm" variant="link">
                            Use another method
                          </Button>
                        </SignIn.Action>
                      </div>
                    </CardFooter>
                  </Card>
                </SignIn.Strategy>

                <SignIn.Strategy name="email_code">
                  <Card className="w-full sm:w-96">
                    <CardHeader>
                      <CardTitle>Check your email</CardTitle>
                      <CardDescription>
                        Enter the verification code sent to your email
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-y-4">
                      <Clerk.Field name="code" className="space-y-2">
                        <Clerk.Label className="text-sm font-medium text-white">Email code</Clerk.Label>
                        <Clerk.Input
                          required
                          className="w-full rounded-md bg-neutral-900 px-3.5 py-2 text-sm text-white outline-none ring-1 ring-inset ring-zinc-700 hover:ring-zinc-600 focus:bg-transparent focus:ring-[1.5px] focus:ring-blue-400 data-[invalid]:ring-red-400"
                        />
                        <Clerk.FieldError className="block text-sm text-red-400" />
                      </Clerk.Field>
                    </CardContent>
                    <CardFooter>
                      <div className="grid w-full gap-y-4">
                        <SignIn.Action submit asChild>
                          <Button disabled={isGlobalLoading}>
                            <Clerk.Loading>
                              {(isLoading) => {
                                return isLoading ? (
                                  <Icons.spinner className="size-4 animate-spin" />
                                ) : (
                                  \'Continue\'
                                )
                              }}
                            </Clerk.Loading>
                          </Button>
                        </SignIn.Action>
                        <SignIn.Action navigate="choose-strategy" asChild>
                          <Button type="button" size="sm" variant="link">
                            Use another method
                          </Button>
                        </SignIn.Action>
                      </div>
                    </CardFooter>
                  </Card>
                </SignIn.Strategy>
              </SignIn.Step>
            </>
          )}
        </Clerk.Loading>
      </SignIn.Root>
    </div>
  )
}
```

---

## Setting Clerk Publishable and Secret Keys (General)

**Opis:** Defines the general environment variables `CLERK_PUBLISHABLE_KEY` for frontend use and `CLERK_SECRET_KEY` for backend use. These keys are essential for authenticating your application with Clerk and are found on the Clerk Dashboard API keys page. The secret key must not be exposed publicly.

**Źródło:** https://github.com/clerk/clerk-docs/blob/main/docs/deployments/clerk-environment-variables.mdx#2025-04-23_snippet_0

```markdown
| Variable | Description |
| - | - |
| `CLERK_PUBLISHABLE_KEY` | Your Clerk app\'s Publishable Key. It will be prefixed with `pk_test_` in development instances and `pk_live_` in production instances. |
| `CLERK_SECRET_KEY` | Your Clerk app\'s Secret Key, which you can find in the Clerk Dashboard. It will be prefixed with `sk_test_` in development instances and `sk_live_` in production instances. **Do not expose this on the frontend with a public environment variable**. |
```

---

## Implementing Custom Sign-Up Screen (TypeScript/TSX)

**Opis:** Creates a sign-up screen component using React Native elements and the `useSignUp` hook from `@clerk/clerk-expo`. It handles user input for email and password, initiates the sign-up process, requests email verification via code, captures the verification code, attempts verification, and sets the session active upon success, redirecting the user.

**Źródło:** https://github.com/clerk/clerk-docs/blob/main/docs/quickstarts/expo.mdx#2025-04-23_snippet_6

```tsx
import * as React from \'react\'
import { Text, TextInput, TouchableOpacity, View } from \'react-native\'
import { useSignUp } from \'@clerk/clerk-expo\'
import { Link, useRouter } from \'expo-router\'

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState(\'\')
  const [password, setPassword] = React.useState(\'\')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState(\'\')

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return

    console.log(emailAddress, password)

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      })

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: \'email_code\' })

      // Set \'pendingVerification\' to true to display second form
      // and capture OTP code
      setPendingVerification(true)
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === \'complete\') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace(\'/\')
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  if (pendingVerification) {
    return (
      <>
        <Text>Verify your email</Text>
        <TextInput
          value={code}
          placeholder="Enter your verification code"
          onChangeText={(code) => setCode(code)}
        />
        <TouchableOpacity onPress={onVerifyPress}>
          <Text>Verify</Text>
        </TouchableOpacity>
      </>
    )
  }

  return (
    <View>
      <>
        <Text>Sign up</Text>
        <TextInput
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          onChangeText={(email) => setEmailAddress(email)}
        />
        <TextInput
          value={password}
          placeholder="Enter password"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
        <TouchableOpacity onPress={onSignUpPress}>
          <Text>Continue</Text>
        </TouchableOpacity>
        <View style={{ display: \'flex\', flexDirection: \'row\', gap: 3 }}>
          <Text>Already have an account?</Text>
          <Link href="/sign-in">
            <Text>Sign in</Text>
          </Link>
        </View>
      </>
    </View>
  )
}
```

---

## Configuring Clerk API Keys in .env File (Env)

**Opis:** Defines the necessary environment variables (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`) in the `.env` file. These keys are obtained from the Clerk Dashboard and are essential for authenticating the Next.js application with Clerk services.

**Źródło:** https://github.com/clerk/clerk-docs/blob/main/docs/quickstarts/nextjs-pages-router.mdx#2025-04-23_snippet_4

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY={{pub_key}}
CLERK_SECRET_KEY={{secret}}
```

---

## Building the Home Page UI with React Server Components

**Opis:** Next.js home page component that retrieves user messages from the database and displays them. It allows users to add new messages or delete existing ones using the Server Actions. The component uses Clerk\'s auth() helper to get the user ID for database queries.

**Źródło:** https://github.com/clerk/clerk-docs/blob/main/docs/integrations/databases/neon.mdx#2025-04-23_snippet_8

```tsx
import { createUserMessage, deleteUserMessage } from \'./actions\'
import { db } from \'./db\'
import { auth } from \'@clerk/nextjs/server\'

export default async function Home() {
  const { userId } = await auth()
  if (!userId) throw new Error(\'User not found\')
  const existingMessage = await db.query.UserMessages.findFirst({
    where: (messages, { eq }) => eq(messages.user_id, userId),
  })

  return (
    <main>
      <h1>Neon + Clerk Example</h1>
      {existingMessage ? (
        <div>
          <p>{existingMessage.message}</p>
          <form action={deleteUserMessage}>
            <button>Delete Message</button>
          </form>
        </div>
      ) : (
        <form action={createUserMessage}>
          <input type="text" name="message" placeholder="Enter a message" />
          <button>Save Message</button>
        </form>
      )}
    </main>
  )
}
```

---

## Authenticate and Authorize Next.js Route Handler with Clerk auth().has()

**Opis:** Shows how to secure a Next.js App Router Route Handler using Clerk\'s auth(). It first checks for user authentication via userId (returning 401 if not signed in) and then verifies specific permissions using has() (returning 403 if unauthorized). Requires @clerk/nextjs/server.

**Źródło:** https://github.com/clerk/clerk-docs/blob/main/docs/organizations/verify-user-permissions.mdx#_snippet_6

```tsx
import { auth } from \'@clerk/nextjs/server\'

export const GET = async () => {
  const { userId, has } = await auth()

  // Check if the user is authenticated
  if (!userId) {
    return Response.json({ error: \'User is not signed in\' }, { status: 401 })
  }

  // Check if the user is authorized
  const canRead = has({ permission: \'org:team_settings:read\' })

  // If has() returns false, the user does not have the correct permissions
  // You can choose how your app responds. This example returns a 403 error.
  if (!canRead)
    return Response.json({ error: \'User does not have the correct permissions\' }, { status: 403 })

  // If the user is both authenticated and authorized, move forward with your logic
  return users.getTeams(userId)
}
```

---

## Configuring Clerk Environment Variables

**Opis:** Setting up required Clerk API keys in the environment configuration file.

**Źródło:** https://github.com/clerk/clerk-docs/blob/main/docs/quickstarts/remix.mdx#2025-04-23_snippet_1

```env
CLERK_PUBLISHABLE_KEY={{pub_key}}
CLERK_SECRET_KEY={{secret}}
```

---

## Implementing ClerkProvider in Next.js Pages Router

**Opis:** This code shows how to integrate ClerkProvider into a Next.js application using the Pages Router. It wraps the entire application to provide authentication context.

**Źródło:** https://github.com/clerk/clerk-docs/blob/main/docs/components/clerk-provider.mdx#2025-04-23_snippet_1

```tsx
import { ClerkProvider } from \'@clerk/nextjs\'
import type { AppProps } from \'next/app\'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider {...pageProps}>
      <Component {...pageProps} />
    </ClerkProvider>
  )
}

export default MyApp
```

---

## Accessing User Data with useUser() Hook in React TSX

**Opis:** This component uses Clerk\'s useUser() hook to access the current user\'s data. It handles three states: loading (when user data is being fetched), unauthenticated (when no user is signed in), and authenticated (when a user is signed in). When authenticated, it displays a personalized greeting using the user\'s first name.

**Źródło:** https://github.com/clerk/clerk-docs/blob/main/docs/_partials/hooks/use-user.mdx#2025-04-23_snippet_0

```tsx
export default function Example() {
  const { isSignedIn, user, isLoaded } = useUser()

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  if (!isSignedIn) {
    return <div>Sign in to view this page</div>
  }

  return <div>Hello {user.firstName}!</div>
}
```

---

## Implementing Email/Password Sign-up with Verification using Clerk Elements in React

**Opis:** This code snippet showcases a complete sign-up flow implementation using Clerk Elements in a React component. It includes email and password input fields, email verification, and styling using Tailwind CSS. The component handles both the initial sign-up step and the email verification step.

**Źródło:** https://github.com/clerk/clerk-docs/blob/main/docs/customization/elements/examples/sign-up.mdx#2025-04-23_snippet_0

```tsx
\'use client\'

import * as Clerk from \'@clerk/elements/common\'
import * as SignUp from \'@clerk/elements/sign-up\'

export default function SignUpPage() {
  return (
    <div className="grid w-full flex-grow items-center bg-black px-4 sm:justify-center">
      <SignUp.Root>
        <SignUp.Step
          name="start"
          className="w-full space-y-6 rounded-2xl bg-neutral-900 bg-[radial-gradient(circle_at_50%_0%,theme(colors.white/10%),transparent)] px-4 py-10 ring-1 ring-inset ring-white/5 sm:w-96 sm:px-8"
        >
          <header className="text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 40 40"
              className="mx-auto size-10"
            >
              <mask id="a" width="40" height="40" x="0" y="0" maskUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="20" fill="#D9D9D9" />
              </mask>
              <g fill="#fff" mask="url(#a)">
                <path d="M43.5 3a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46V2ZM43.5 8a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46V7ZM43.5 13a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1ZM43.5 18a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1ZM43.5 23a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1ZM43.5 28a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1ZM43.5 33a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1ZM43.5 38a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1Z" />
                <path d="M27 3.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM25 8.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM23 13.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM21.5 18.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM20.5 23.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM22.5 28.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM25 33.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM27 38.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2Z" />
              </g>
            </svg>
            <h1 className="mt-4 text-xl font-medium tracking-tight text-white">
              Create an account
            </h1>
          </header>
          <Clerk.GlobalError className="block text-sm text-red-400" />
          <div className="space-y-4">
            <Clerk.Field name="emailAddress" className="space-y-2">
              <Clerk.Label className="text-sm font-medium text-white">Email address</Clerk.Label>
              <Clerk.Input
                type="text"
                required
                className="w-full rounded-md bg-neutral-900 px-3.5 py-2 text-sm text-white outline-none ring-1 ring-inset ring-zinc-700 hover:ring-zinc-600 focus:bg-transparent focus:ring-[1.5px] focus:ring-blue-400 data-[invalid]:ring-red-400"
              />
              <Clerk.FieldError className="block text-sm text-red-400" />
            </Clerk.Field>
            <Clerk.Field name="password" className="space-y-2">
              <Clerk.Label className="text-sm font-medium text-white">Password</Clerk.Label>
              <Clerk.Input
                type="password"
                required
                className="w-full rounded-md bg-neutral-900 px-3.5 py-2 text-sm text-white outline-none ring-1 ring-inset ring-zinc-700 hover:ring-zinc-600 focus:bg-transparent focus:ring-[1.5px] focus:ring-blue-400 data-[invalid]:ring-red-400"
              />
              <Clerk.FieldError className="block text-sm text-red-400" />
            </Clerk.Field>
          </div>
          <SignUp.Captcha className="empty:hidden" />
          <SignUp.Action
            submit
            className="relative isolate w-full rounded-md bg-blue-500 px-3.5 py-1.5 text-center text-sm font-medium text-white shadow-[0_1px_0_0_theme(colors.white/10%)_inset,0_0_0_1px_theme(colors.white/5%)] outline-none before:absolute before:inset-0 before:-z-10 before:rounded-md before:bg-white/5 before:opacity-0 hover:before:opacity-100 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-blue-400 active:text-white/70 active:before:bg-black/10"
          >
            Sign Up
          </SignUp.Action>
          <p className="text-center text-sm text-zinc-400">
            Have an account?{\' \'}
            <Clerk.Link
              navigate="sign-in"
              className="font-medium text-white decoration-white/20 underline-offset-4 outline-none hover:underline focus-visible:underline"
            >
              Sign in
            </Clerk.Link>
          </p>
        </SignUp.Step>
        <SignUp.Step
          name="verifications"
          className="w-full space-y-6 rounded-2xl bg-neutral-900 bg-[radial-gradient(circle_at_50%_0%,theme(colors.white/10%),transparent)] px-4 py-10 ring-1 ring-inset ring-white/5 sm:w-96 sm:px-8"
        >
          <header className="text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 40 40"
              className="mx-auto size-10"
            >
              <mask id="a" width="40" height="40" x="0" y="0" maskUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="20" fill="#D9D9D9" />
              </mask>
              <g fill="#fff" mask="url(#a)">
                <path d="M43.5 3a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46V2ZM43.5 8a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46V7ZM43.5 13a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1ZM43.5 18a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1ZM43.5 23a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1ZM43.5 28a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1ZM43.5 33a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1ZM43.5 38a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1Z" />
                <path d="M27 3.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM25 8.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM23 13.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM21.5 18.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM20.5 23.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM22.5 28.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM25 33.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM27 38.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2Z" />
              </g>
            </svg>
            <h1 className="mt-4 text-xl font-medium tracking-tight text-white">
              Verify email code
            </h1>
          </header>
          <Clerk.GlobalError className="block text-sm text-red-400" />
          <SignUp.Strategy name="email_code">
            <Clerk.Field name="code" className="space-y-2">
              <Clerk.Label className="text-sm font-medium text-white">Email code</Clerk.Label>
              <Clerk.Input
                required
                className="w-full rounded-md bg-neutral-900 px-3.5 py-2 text-sm text-white outline-none ring-1 ring-inset ring-zinc-700 hover:ring-zinc-600 focus:bg-transparent focus:ring-[1.5px] focus:ring-blue-400 data-[invalid]:ring-red-400"
              />
              <Clerk.FieldError className="block text-sm text-red-400" />
            </Clerk.Field>
            <SignUp.Action
              submit
              className="relative isolate w-full rounded-md bg-blue-500 px-3.5 py-1.5 text-center text-sm font-medium text-white shadow-[0_1px_0_0_theme(colors.white/10%)_inset,0_0_0_1px_theme(colors.white/5%)] outline-none before:absolute before:inset-0 before:-z-10 before:rounded-md before:bg-white/5 before:opacity-0 hover:before:opacity-100 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-blue-400 active:text-white/70 active:before:bg-black/10"
            >
              Finish registration
            </SignUp.Action>
          </SignUp.Strategy>
          <p className="text-center text-sm text-zinc-400">
            Have an account?{\' \'}
            <Clerk.Link
              navigate="sign-in"
              className="font-medium text-white decoration-white/20 underline-offset-4 outline-none hover:underline focus-visible:underline"
            >
              Sign in
            </Clerk.Link>
          </p>
        </SignUp.Step>
      </SignUp.Root>
    </div>
  )
}
```

---

## Framework Auth Object Access Methods

**Opis:** A reference table showing how to access the Auth object in different frameworks. The Auth object is accessible through framework-specific helper functions or directly from the request object depending on the framework being used.

**Źródło:** https://github.com/clerk/clerk-docs/blob/main/docs/_partials/auth-object-table.mdx#2025-04-23_snippet_0

```markdown
| Framework | How to access the `Auth` object |
| - | - |
| Next.js App Router | [`auth()`](/docs/references/nextjs/auth) |
| Next.js Pages Router | [`getAuth()`](/docs/references/nextjs/get-auth) |
| Astro | [`locals.auth()`](/docs/references/astro/locals#locals-auth) |
| Express | [`req.auth`](/docs/references/express/overview) |
| React Router | [`getAuth()`](/docs/references/react-router/get-auth) |
| Remix | [`getAuth()`](/docs/references/remix/read-session-data#get-auth) |
| Tanstack React Start | [`getAuth()`](/docs/references/tanstack-react-start/get-auth) |
| Other | `request.auth` |
```

---

## Initializing ClerkProvider in Root Layout (TypeScript/TSX)

**Opis:** Wraps the application\'s root component (`Slot` from `expo-router`) with the `ClerkProvider` component from `@clerk/clerk-expo`. This initializes Clerk within the application, making authentication context available throughout the component tree. Requires the Clerk Publishable Key to be set as an environment variable.

**Źródło:** https://github.com/clerk/clerk-docs/blob/main/docs/quickstarts/expo.mdx#2025-04-23_snippet_2

```tsx
import { ClerkProvider } from \'@clerk/clerk-expo\'
import { Slot } from \'expo-router\'

export default function RootLayout() {
  return (
    <ClerkProvider>
      <Slot />
    </ClerkProvider>
  )
}
```

</rewritten_file> 