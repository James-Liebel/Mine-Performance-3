import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="px-6 py-20 md:px-12 lg:px-24 min-h-[60vh] flex flex-col justify-center items-center text-center">
      <h1 className="font-display text-4xl font-bold text-neutral-900">Page not found</h1>
      <p className="mt-4 text-neutral-600">The page you’re looking for doesn’t exist or has been moved.</p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center px-6 py-3 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
      >
        Back to home
      </Link>
    </div>
  );
}
