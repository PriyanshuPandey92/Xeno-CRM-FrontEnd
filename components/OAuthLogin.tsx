"use client";
import useAuthStore from '@/app/store/useAuthStore';
import { GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const OAuthLogin = () => {
  const { isLoggedIn, login } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem('googleIdToken');
    if (token) {
      login(JSON.parse(sessionStorage.getItem('user') || '{}'));
    }
  }, []);

  // Redirect to dashboard when user is logged in
  useEffect(() => {
    if (isLoggedIn && !isLoading) {
      router.push('/dashboard');
    }
  }, [isLoggedIn, isLoading, router]);

  const handleSuccess = async (response: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { credential } = response;
      if (!credential) {
        throw new Error('No credential received from Google');
      }

      sessionStorage.setItem('googleIdToken', credential);
      
      const res = await fetch('/api/auth/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: credential }),
      });

      const data = await res.json();

      if (data.success) {
        login(data.user);
        sessionStorage.setItem('user', JSON.stringify(data.user));
        console.log('User created or logged in:', data.user);
        // Redirect will happen via useEffect
      } else {
        throw new Error(data.message || 'Authentication failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unable to login. Please try again.';
      setError(errorMessage);
      console.error('OAuth error:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFailure = () => {
    setError('Authentication failed. Please try again.');
    setIsLoading(false);
    console.error('OAuth error: Failed to authenticate');
  };

  // Loading Spinner Component
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
      <span className="text-gray-600">Signing in...</span>
    </div>
  );

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg w-full max-w-md text-center">
          <p className="font-medium">Login Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg w-full max-w-md">
          <LoadingSpinner />
        </div>
      )}

      {/* Conditional rendering */}
      {!isLoggedIn ? (
        <div className={`${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
          <GoogleLogin 
            onSuccess={handleSuccess} 
            onError={handleFailure}
          />
        </div>
      ) : (
        <button 
          onClick={() => router.push('/dashboard')}
          className='cursor-pointer bg-gradient-to-br from-purple-600 via-pink-500 to-pink-400 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200'
        >
          Go To Dashboard
        </button>
      )}
    </div>
  );
};

export default OAuthLogin;