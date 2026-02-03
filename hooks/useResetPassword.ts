import { useCallback } from 'react';
import { useAPI } from './useAPI';
import { blockingPost } from './useBlockingAPI';

interface ResetPasswordResponse {
  message: string;
}

export function useResetPassword() {
  const { execute, data, error, loading, reset } = useAPI<ResetPasswordResponse>();

  const resetPassword = useCallback(async (token: string, newPassword: string) => {
    return execute(() =>
      blockingPost<ResetPasswordResponse>('/auth/reset-password', {
        token,
        new_password: newPassword
      })
    );
  }, [execute]);

  return { resetPassword, data, error, loading, reset };
}
