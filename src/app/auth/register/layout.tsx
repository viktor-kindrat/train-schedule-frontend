import { Metadata } from 'next';
import { ReadonlyChildren } from '@/types/common/ui/i-readonly-children';

export const metadata: Metadata = { title: 'Register' };

export default function Layout({ children }: ReadonlyChildren) {
  return children;
}
