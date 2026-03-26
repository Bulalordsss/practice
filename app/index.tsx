import { Redirect } from 'expo-router';

import { useLoginStoreData } from '@/stores/loginStoreData';

export default function IndexScreen() {
  const isAuthenticated = useLoginStoreData((s) => s.isAuthenticated);

  return <Redirect href={isAuthenticated ? '/(tabs)' : '/login'} />;
}
