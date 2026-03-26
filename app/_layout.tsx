import { Redirect, Stack, usePathname } from 'expo-router';

import { useLoginStoreData } from '@/stores/loginStoreData';

export default function Layout() {
  const isAuthenticated = useLoginStoreData((s) => s.isAuthenticated);
  const pathname = usePathname();

  if (isAuthenticated && pathname === '/login') {
    return <Redirect href={{ pathname: '/(tabs)' as any }} />;
  }

  const publicRoutes = ['/login', '/'];
  const isPublicRoute = publicRoutes.includes(pathname);

  if (!isAuthenticated && !isPublicRoute) {
    return <Redirect href={{ pathname: '/login' as any }} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
