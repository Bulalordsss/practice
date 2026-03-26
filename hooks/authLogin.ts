import { useLoginStoreData } from '@/stores/loginStoreData';
import { useLoginUIState } from '@/stores/loginUIState';

const STATIC_USERNAME = 'user';
const STATIC_PASSWORD = 'pass';

export function useAuthLogin() {
  const setAuth = useLoginStoreData((s) => s.setAuth);

  const enteredUsername = useLoginUIState((s) => s.username);
  const enteredPassword = useLoginUIState((s) => s.password);
  const isSubmitting = useLoginUIState((s) => s.isSubmitting);
  const setSubmitting = useLoginUIState((s) => s.setSubmitting);
  const error = useLoginUIState((s) => s.error);
  const setError = useLoginUIState((s) => s.setError);

  const login = async () => {
    setSubmitting(true);
    setError(null);

    try {
      if (enteredUsername !== STATIC_USERNAME || enteredPassword !== STATIC_PASSWORD) {
        throw new Error('Invalid username or password');
      }

      setAuth({
        user: { username: enteredUsername },
        token: 'static-token',
      });
    } catch (e: any) {
      setError(e?.message ?? 'Login failed');
      throw e;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    username: enteredUsername,
    password: enteredPassword,
    isSubmitting,
    error,
    login,
  };
}
