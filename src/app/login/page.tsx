import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { NaNeetPrepLogo } from '@/components/icons';
import { PlaceHolderImages } from '@/lib/placeholder-images';

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Google</title>
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.05 1.05-2.83 3.18-5.78 3.18-4.46 0-8.12-3.65-8.12-8.12s3.66-8.12 8.12-8.12c2.48 0 4.1.94 5.04 1.82l2.6-2.6C18.1 2.2 15.48 1 12.48 1 5.88 1 1 5.98 1 12.5s4.88 11.5 11.48 11.5c6.9 0 11.1-4.72 11.1-11.26 0-.75-.08-1.47-.2-2.18h-11z" />
    </svg>
  );
}

export default function LoginPage() {
  const loginImage = PlaceHolderImages.find(p => p.id === 'login-hero');

  async function login() {
    'use server';
    // In a real app, this would involve an OAuth flow with Google.
    // For this prototype, we'll just redirect to the admin dashboard.
    redirect('/admin/dashboard');
  }

  return (
    <div className="w-full lg:grid lg:min-h-[calc(100vh-57px)] lg:grid-cols-2 xl:min-h-[calc(100vh-57px)]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <div className="flex items-center justify-center gap-2">
              <NaNeetPrepLogo className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold font-headline">Admin Login</h1>
            </div>
            <p className="text-balance text-muted-foreground">
              Please log in using the verified admin Gmail account.
            </p>
          </div>
          <form action={login}>
            <Button variant="outline" className="w-full" type="submit">
              <GoogleIcon className="mr-2 h-4 w-4" />
              Login with Google
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Not an admin?{' '}
            <Link href="/" className="underline">
              Go back to student portal
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        {loginImage && (
            <Image
            src={loginImage.imageUrl}
            alt="Login background"
            data-ai-hint={loginImage.imageHint}
            width="1920"
            height="1080"
            className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
        )}
      </div>
    </div>
  );
}
