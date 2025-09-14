import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Train Schedule',
    template: '%s | Train Schedule',
  },
  description: 'A simple train schedule app with admin panel.',
  icons: {
    icon: [
      {
        url: '/meta/favicon-light.svg',
        media: '(prefers-color-scheme: light)',
        type: 'image/svg+xml',
      },
      {
        url: '/meta/favicon-dark.svg',
        media: '(prefers-color-scheme: dark)',
        type: 'image/svg+xml',
      },
    ],
    shortcut: '/meta/favicon.ico',
    apple: '/meta/apple-touch-icon.png',
    other: [{ rel: 'mask-icon', url: '/meta/safari-pinned-tab.svg', color: '#000000' }],
  },
};
