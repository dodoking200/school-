// components/LoginForm/ErrorText.tsx
interface ErrorTextProps {
  message?: string;
}

export function ErrorText({ message }: ErrorTextProps) {
  if (!message) return null;
  return <p className="text-red-500 text-sm mt-1">{message}</p>;
}
