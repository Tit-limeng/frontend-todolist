import React from 'react'

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  helperText?: string
}

export default function FormInput({
  label,
  error,
  helperText,
  ...props
}: FormInputProps) {
  return (
    <div className="mb-4">
      <label htmlFor={props.id} className="block text-sm font-medium text-foreground mb-2">
        {label}
      </label>
      <input
        {...props}
        className={`w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
          error
            ? 'border-destructive bg-destructive/5'
            : 'border-border bg-card text-foreground hover:border-primary/50'
        }`}
      />
      {error && (
        <p className="mt-1 text-sm text-destructive">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  )
}
