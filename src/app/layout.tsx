import '@/app/(style)/globals.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import '@/app/(style)/override-prime-react-theme.css';

import { arimo, oswald } from '@/lib/common/fonts';
import { ReadonlyChildren } from '@/types/common/ui/i-readonly-children';
import PrimeLocaleBootstrap from '@/components/common/prime-locale-bootstrap';

export { metadata } from './(meta)/metadata';

export default function RootLayout({ children }: ReadonlyChildren) {
  return (
    <html lang="uk">
      <body className={`${oswald.variable} ${arimo.variable} antialiased`}>
        <PrimeLocaleBootstrap />
        {children}
      </body>
    </html>
  );
}
