'use client';
import { useSearchParams } from 'next/navigation';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
        <p className="text-gray-700">
          {error === 'Configuration' && 'There is a problem with the server configuration.'}
          {error === 'AccessDenied' && 'You do not have permission to sign in.'}
          {error === 'Verification' && 'The verification link has expired or has already been used.'}
          {!error && 'An error occurred during authentication.'}
        </p>
      </div>
    </div>
  );
}