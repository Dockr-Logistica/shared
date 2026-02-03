import { useCallback } from 'react';
import { useAPI } from './useAPI';
import { blockingPost } from './useBlockingAPI';

interface ForgotPasswordResponse {
  message: string;
}

export function useForgotPassword() {
  const { execute, data, error, loading, reset } = useAPI<ForgotPasswordResponse>();

  const forgotPassword = useCallback(async (email: string) => {
    return execute(() => blockingPost<ForgotPasswordResponse>('/auth/forgot-password', { email }));
  }, [execute]);

  return { forgotPassword, data, error, loading, reset };
}
