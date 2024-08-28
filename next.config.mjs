import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';
import createNextIntlPlugin from 'next-intl/plugin';

// Here we use the @cloudflare/next-on-pages next-dev module to allow us to use bindings during local development
// (when running the application with `next dev`), for more information see:
// https://github.com/cloudflare/next-on-pages/blob/5712c57ea7/internal-packages/next-dev/README.md
if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform();
}
const withNextIntl = createNextIntlPlugin('./src/lib/i18n/index.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{
      'protocol': 'https',
      'hostname': 'lh3.googleusercontent.com',
    }]
  }
};

export default withNextIntl(nextConfig);