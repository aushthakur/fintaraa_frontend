# Fintaraa Website

Next.js website for the Fintaraa project.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Development

Run the local development server:

```bash
npm run dev
```

The production start script serves the app on port `3002`.

## Analytics configuration

The website supports Google Analytics 4, Google Tag Manager, Meta Pixel, and
Microsoft Clarity. Add the IDs to `.env` (or the deployment environment) and
restart or redeploy the website:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=123456789012345
NEXT_PUBLIC_CLARITY_PROJECT_ID=abcdefghij
```

Blank or invalid IDs are ignored. Initial page views and Next.js client-side
route changes are tracked. GTM receives route changes as the custom
`virtual_page_view` event.

If GA4 or Meta Pixel is configured directly through these environment
variables, do not add a second page-view tag for the same property or pixel
inside GTM, otherwise page views will be counted twice.
