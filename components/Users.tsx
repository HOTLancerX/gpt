'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import Auth from './Auth';

export default function Users() {
  const { data: session, status } = useSession();
  const [showAuth, setShowAuth] = useState(false);

  if (status === 'loading') {
    return <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>;
  }

  if (session) {
    return (
      <div className="relative">
        <div className="flex items-center space-x-3">
          <img
            src={session.user?.image || '/default-avatar.png'}
            alt={session.user?.name || 'User'}
            className="w-8 h-8 rounded-full"
          />
          <span className="text-sm font-medium text-gray-700">
            {session.user?.name}
          </span>
          <div className="relative group">
            <button className="text-gray-400 hover:text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <Link
                href="/me"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                My account
              </Link>
              <button
                onClick={() => signOut()}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowAuth(true)}
        className="text-sm font-medium text-gray-700 hover:text-gray-900"
      >
        Login
      </button>
      
      {showAuth && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="relative w-full max-w-xl mx-auto">
            <button
              onClick={() => setShowAuth(false)}
              className="absolute -top-10 right-0 text-white text-2xl"
            >
              ×
            </button>
            <Auth />
          </div>
        </div>
      )}
    </>
  );
}