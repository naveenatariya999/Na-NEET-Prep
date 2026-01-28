'use client';

import { useUser } from '@/firebase';

// IMPORTANT: The admin's email address is hardcoded here.
const ADMIN_EMAIL = 'naveenatariya999@gmail.com';

export function useAdmin() {
  const { user, isUserLoading } = useUser();

  // Admin status is determined by matching the logged-in user's email.
  const isAdmin = user?.email === ADMIN_EMAIL;
  
  // isLoading is true only while the user's authentication state is being determined.
  const isLoading = isUserLoading;

  return { isAdmin, isLoading };
}
