import { cookies } from 'next/headers';
import Header from '@/components/landing/header';
import Hero from '@/components/landing/hero';
import Features from '@/components/landing/features';
import FAQ from '@/components/landing/faq';
import Footer from '@/components/landing/footer';

export default async function LandingPage() {
  const jar = await cookies();
  const token = jar.get('auth-token')?.value;
  const ctaHref = token ? '/dashboard' : '/auth/login';

  return (
    <main className="flex min-h-dvh flex-col">
      <Header ctaHref={ctaHref} />
      <Hero ctaHref={ctaHref} />
      <Features />
      <FAQ />
      <Footer />
    </main>
  );
}
