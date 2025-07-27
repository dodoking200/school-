// components/loginform/ErrorHandlingTest.tsx
"use client";

import React, { useState } from 'react';
import { useLoginForm } from './useLoginForm';
import { FormFields } from './FormFields';
import { SubmitButton } from './SubmitButton';
import { ErrorText } from './ErrorText';

/**
 * Test component to demonstrate the improved error handling
 * This component simulates different error scenarios without making actual API calls
 */
export default function ErrorHandlingTest() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    errors,
    isLoading,
    validateForm,
    submitForm,
  } = useLoginForm();

  const [testMode, setTestMode] = useState<'validation' | 'network' | 'api401' | 'api500'>('validation');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    await submitForm(async () => {
      // Simulate different error scenarios based on the selected test mode
      switch (testMode) {
        case 'network':
          // Simulate a network error
          throw new TypeError('Failed to fetch');
        case 'api401':
          // Simulate an API 401 error
          throw new Error('API Error: Authentication failed. Please check your credentials.');
        case 'api500':
          // Simulate an API 500 error
          throw new Error('API Error: Server error. Please try again later.');
        default:
          // In validation mode, we don't throw any errors
          // The form will just show validation errors if any
          console.log('Form submitted successfully in validation test mode');
      }
    });
  };

  return (
    <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-xl">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Error Handling Test
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Test the improved error handling functionality
        </p>
      </div>

      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium text-gray-700">Select Test Mode:</label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={`px-3 py-1 text-sm rounded ${testMode === 'validation' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setTestMode('validation')}
          >
            Validation Errors
          </button>
          <button
            type="button"
            className={`px-3 py-1 text-sm rounded ${testMode === 'network' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setTestMode('network')}
          >
            Network Error
          </button>
          <button
            type="button"
            className={`px-3 py-1 text-sm rounded ${testMode === 'api401' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setTestMode('api401')}
          >
            API 401 Error
          </button>
          <button
            type="button"
            className={`px-3 py-1 text-sm rounded ${testMode === 'api500' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setTestMode('api500')}
          >
            API 500 Error
          </button>
        </div>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-md -space-y-px">
          <FormFields
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            errors={errors}
          />
        </div>

        {/* Display general form errors that aren't field-specific */}
        {errors.general && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
            <ErrorText message={errors.general} />
          </div>
        )}

        <div>
          <SubmitButton isLoading={isLoading} />
        </div>

        <div className="mt-4 text-sm text-gray-500">
          <p>Current test mode: <span className="font-semibold">{testMode}</span></p>
          <p className="mt-1">This will simulate a {testMode === 'validation' ? 'validation error (if form is invalid)' : testMode === 'network' ? 'network connectivity issue' : `${testMode} API error`}</p>
        </div>
      </form>
    </div>
  );
}