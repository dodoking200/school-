// components/LoginForm/SubmitButton.tsx
interface SubmitButtonProps {
  isLoading: boolean;
}

export function SubmitButton({ isLoading }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-4xl text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-hover)] mt-6 ${
        isLoading ? "opacity-70 cursor-not-allowed" : ""
      }`}
    >
      {isLoading ? "Logging in..." : "Login"}
    </button>
  );
}
