import { cookies } from 'next/headers';
import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import FAQ from '@/components/landing/FAQ';
import Footer from '@/components/landing/Footer';

export default async function LandingPage() {
  const token = (await cookies()).get('auth-token')?.value;
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
