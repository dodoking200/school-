// components/loginform/TestNavigation.tsx
"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function TestNavigation() {
  const [showNav, setShowNav] = useState(false);

  return (
    <div className="fixed bottom-4 right-4">
      {showNav ? (
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Developer Tools</h3>
            <button 
              onClick={() => setShowNav(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="space-y-2">
            <Link 
              href="/error-test"
              className="block px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded"
            >
              Error Handling Test
            </Link>
            <Link 
              href="/"
              className="block px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded"
            >
              Login Page
            </Link>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowNav(true)}
          className="bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          title="Developer Tools"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      )}
    </div>
  );
}