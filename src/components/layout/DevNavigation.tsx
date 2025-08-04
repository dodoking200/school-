import React from 'react';
import Link from 'next/link';

export default function DevNavigation() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-gray-800 text-white p-2 rounded-lg shadow-lg">
        <div className="text-xs font-semibold mb-1 text-gray-300">Developer Tools</div>
        <div className="flex flex-col space-y-1">
          <Link 
            href="/"
            className="text-sm hover:text-blue-300 transition"
          >
            Home
          </Link>
          <Link 
            href="/table-examples"
            className="text-sm hover:text-blue-300 transition"
          >
            Table Examples
          </Link>
          <Link 
            href="/login"
            className="text-sm hover:text-blue-300 transition"
          >
            Login
          </Link>
          <Link 
            href="/error-test"
            className="text-sm hover:text-blue-300 transition"
          >
            Error Test
          </Link>
        </div>
      </div>
    </div>
  );
}