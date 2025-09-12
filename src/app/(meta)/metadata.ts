import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Dashboard',
    template: '%s | Train Schedule',
  },
  description: 'A simple train schedule app with admin panel.',
  icons: {
    icon: [
      {
        url: './(overview)/favicon-light.svg',
        media: '(prefers-color-scheme: light)',
        type: 'image/svg+xml',
      },
      {
        url: './(overview)/favicon-dark.svg',
        media: '(prefers-color-scheme: dark)',
        type: 'image/svg+xml',
      },
    ],
    shortcut: './(meta)/favicon.ico',
    apple: './(meta)/apple-touch-icon.png',
    other: [{ rel: 'mask-icon', url: './(overview)/safari-pinned-tab.svg', color: '#000000' }],
  },
};
