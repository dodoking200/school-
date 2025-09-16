// components/LoginForm/SubmitButton.tsx
interface SubmitButtonProps {
  isLoading: boolean;
}

export function SubmitButton({ isLoading }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className={`btn-primary w-full py-3 px-6 text-base font-semibold transition-all duration-300 hover:transform hover:translateY(-1px) hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none`}
    >
      {isLoading ? (
        <>
          <div className="loading-spinner w-4 h-4 !border-white !border-t-transparent" />
          <span>Signing In...</span>
        </>
      ) : (
        <>
          <span>🚀</span>
          <span>Sign In</span>
        </>
      )}
    </button>
  );
}
