import { ReadonlyChildren } from '@/types/common/ui/i-readonly-children';

export default function DashboardLayout({ children }: ReadonlyChildren) {
  return <main className="w-full">{children}</main>;
}
