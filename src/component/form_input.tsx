import React from 'react'

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  helperText?: string
  rightIcon?: React.ReactNode;

}


export default function FormInput({
   label,
  error,
  helperText,
  rightIcon,
  ...props
}: FormInputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          {...props}
          
          className={`w-full rounded-lg border px-3 py-2 pr-10 outline-none ${
            error
              ? "border-red-500"
              : "border-gray-300 focus:border-blue-500"
          }`}
        />

        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightIcon}
          </div>
        )}
      </div>

      {/* {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )} */}

            {error && (
        <p className="mt-1 text-sm text-destructive">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}