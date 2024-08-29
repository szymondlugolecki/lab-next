This is a [Next.js](https://nextjs.org/) project bootstrapped with [`c3`](https://developers.cloudflare.com/pages/get-started/c3).

# Lab
Personal medical blog built to help me develop my passion for medicine  
STILL IN EARLY DEVELOPMENT!  

## Features
👥 User Management with Roles  
📔 Articles (/w advanced privacy settings involing roles, etc.)  
🔐 Login via Google  
ℹ️ Internalization Support (English, Polish)  
⚡ Fast & Built for the Edge (Cloudflare Workers)  
☁️ All articles are stored in a seperate repo on Github as JSON files

To be added in the future:  
📱 PWA (not yet)  
🤖 AI powered functions (translation, suggestions, image generation)  

## TODO:  
[] Make the home page & search work  
[] Add comments  
[] Add user profile page  
[] Fully develop article privacy settings (adding access for a specific user, etc.)  
[] Add error pages  
[] Fix some routes not being displayed correctly for unauthorized users  
[] PWA  
[] AI suggestions, image generation, translation  


## Tech stack
Next.js 14  
Typescript  
Auth.js  
react-hook-form  
Tailwind  
Cloudflare Workers  
DrizzleORM & Cloudflare D1  

Other: shadcn, tiptap, next-intl, zod  
  
## Images
![image](https://github.com/user-attachments/assets/066e3363-f630-4270-8e76-24c6d506a944)
![image](https://github.com/user-attachments/assets/38b3d0f3-86fa-4e78-8f66-920a30db97ef)
![image](https://github.com/user-attachments/assets/0feea564-430f-4e30-b907-c13d1b3cddc2)
![image](https://github.com/user-attachments/assets/2e84140e-0870-49ad-82bc-155c9720840e)
![image](https://github.com/user-attachments/assets/15443dad-d6c8-4420-b504-ecc67469f6b5)
![image](https://github.com/user-attachments/assets/39ba87f5-d5af-42de-987e-aa761d84ec71)
![image](https://github.com/user-attachments/assets/b98136ba-0717-4e53-8de3-7011925d9256)


## ENV
```env
# Auth
AUTH_SECRET=""
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""

# Cloudflare
CLOUDFLARE_ACCOUNT_ID=""
CLOUDFLARE_DATABASE_ID=""
CLOUDFLARE_API_TOKEN=""

# Misc
OWNER_EMAIL=""
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# Github
GITHUB_ACCESS_TOKEN=""
GH_REPO_OWNER=""
GH_REPO_NAME=""

```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Cloudflare integration

Besides the `dev` script mentioned above `c3` has added a few extra scripts that allow you to integrate the application with the [Cloudflare Pages](https://pages.cloudflare.com/) environment, these are:
  - `pages:build` to build the application for Pages using the [`@cloudflare/next-on-pages`](https://github.com/cloudflare/next-on-pages) CLI
  - `preview` to locally preview your Pages application using the [Wrangler](https://developers.cloudflare.com/workers/wrangler/) CLI
  - `deploy` to deploy your Pages application using the [Wrangler](https://developers.cloudflare.com/workers/wrangler/) CLI

> __Note:__ while the `dev` script is optimal for local development you should preview your Pages application as well (periodically or before deployments) in order to make sure that it can properly work in the Pages environment (for more details see the [`@cloudflare/next-on-pages` recommended workflow](https://github.com/cloudflare/next-on-pages/blob/05b6256/internal-packages/next-dev/README.md#recommended-workflow))

### Bindings

Cloudflare [Bindings](https://developers.cloudflare.com/pages/functions/bindings/) are what allows you to interact with resources available in the Cloudflare Platform.

You can use bindings during development, when previewing locally your application and of course in the deployed application:

- To use bindings in dev mode you need to define them in the `next.config.js` file under `setupDevBindings`, this mode uses the `next-dev` `@cloudflare/next-on-pages` submodule. For more details see its [documentation](https://github.com/cloudflare/next-on-pages/blob/05b6256/internal-packages/next-dev/README.md).

- To use bindings in the preview mode you need to add them to the `pages:preview` script accordingly to the `wrangler pages dev` command. For more details see its [documentation](https://developers.cloudflare.com/workers/wrangler/commands/#dev-1) or the [Pages Bindings documentation](https://developers.cloudflare.com/pages/functions/bindings/).

- To use bindings in the deployed application you will need to configure them in the Cloudflare [dashboard](https://dash.cloudflare.com/). For more details see the  [Pages Bindings documentation](https://developers.cloudflare.com/pages/functions/bindings/).

#### KV Example

`c3` has added for you an example showing how you can use a KV binding.

In order to enable the example:
- Search for javascript/typescript lines containing the following comment:
  ```ts
  // KV Example:
  ```
  and uncomment the commented lines below it.
- Do the same in the `wrangler.toml` file, where
  the comment is:
  ```
  # KV Example:
  ```
- If you're using TypeScript run the `cf-typegen` script to update the `env.d.ts` file:
  ```bash
  npm run cf-typegen
  # or
  yarn cf-typegen
  # or
  pnpm cf-typegen
  # or
  bun cf-typegen
  ```

After doing this you can run the `dev` or `preview` script and visit the `/api/hello` route to see the example in action.

Finally, if you also want to see the example work in the deployed application make sure to add a `MY_KV_NAMESPACE` binding to your Pages application in its [dashboard kv bindings settings section](https://dash.cloudflare.com/?to=/:account/pages/view/:pages-project/settings/functions#kv_namespace_bindings_section). After having configured it make sure to re-deploy your application.
