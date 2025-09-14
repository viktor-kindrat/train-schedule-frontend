import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-neutral-200 px-4">
      <div className="max-w-8xl mx-auto flex items-center justify-between py-6">
        <p className="caption-regular text-neutral-500">
          &copy;{new Date().getFullYear()} RailTime. Made by{' '}
          <Link href="https://github.com/viktor-kindrat" className="text-primary-700">
            Viktor Kindrat
          </Link>
        </p>
        <div className="caption-regular flex gap-4 text-neutral-500">
          <Link href="#" className="hover:text-primary-700">
            Privacy
          </Link>
          <Link href="#" className="hover:text-primary-700">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
