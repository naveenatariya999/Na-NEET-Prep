import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-card text-muted-foreground border-t">
      <div className="container flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
        <p className="text-sm">
          &copy; {currentYear} Na-NEET Prep. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm hover:text-primary transition-colors">
            Admin Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
