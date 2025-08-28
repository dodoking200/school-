// components/LoginForm/RememberMeCheckbox.tsx
interface RememberMeCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function RememberMeCheckbox({
  checked,
  onChange,
}: RememberMeCheckboxProps) {
  return (
    <div className="flex items-center">
      <input
        id="remember-me"
        name="remember-me"
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded transition-colors duration-300"
        style={{
          accentColor: "var(--primary)",
          borderColor: "var(--card-border)"
        }}
      />
      <label 
        htmlFor="remember-me" 
        className="ml-3 block text-sm font-medium cursor-pointer transition-colors duration-300"
        style={{ color: "var(--foreground-muted)" }}
      >
        💾 Remember Me
      </label>
    </div>
  );
}
