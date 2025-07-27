// app/error-test/page.tsx

import ErrorHandlingTest from '@/components/loginform/ErrorHandlingTest';
import TestNavigation from '@/components/loginform/TestNavigation';

export default function ErrorTestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <ErrorHandlingTest />
      </div>
      
      {/* Developer Tools Navigation */}
      <TestNavigation />
    </div>
  );
}