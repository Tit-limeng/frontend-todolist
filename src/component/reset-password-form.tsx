
import { useState } from 'react'
import FormInput from './form_input'

interface ResetPasswordFormProps {
  email: string | unknown 
  isLoading?: boolean
  onSubmit: (password: string, confirmPassword: string) => void
  onBack: () => void
}

export default function ResetPasswordForm({
  email,
  isLoading = false,
  onSubmit,
  onBack,
}: ResetPasswordFormProps) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<{
    password?: string
    confirmPassword?: string
  }>({})

  const validateForm = () => {
    const newErrors: typeof errors = {}

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(password, confirmPassword)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Resetting password for {email}
        </label>
        <p className="text-xs text-muted-foreground">
          Enter a strong new password for your account
        </p>
      </div>


      <FormInput
        label="New Password"
        type={showPassword ? "text" : "password"}
        placeholder="Enter new password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value)

          if (errors.password) {
            setErrors({
              ...errors,
              password: undefined,
            })
          }
        }}
        error={errors.password}
        rightIcon={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        }
      />

      {/* <FormInput
        label="Confirm Password"
        type={showConfirmPassword ? 'text' : 'password'}
        placeholder="Confirm new password"
        value={confirmPassword}
        onChange={(value) => {
          setConfirmPassword(value)
          if (errors.confirmPassword)
            setErrors({ ...errors, confirmPassword: undefined })
        }}
        error={errors.confirmPassword}
        rightIcon={
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {showConfirmPassword ? '🙈' : '👁️'}
          </button>
        }
      /> */}

      <FormInput
        label="Confirm Password"
        type={showConfirmPassword ? "text" : "password"}
        placeholder="Confirm new password"
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value)

          if (errors.confirmPassword) {
            setErrors({
              ...errors,
              confirmPassword: undefined,
            })
          }
        }}
        error={errors.confirmPassword}
        rightIcon={
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {showConfirmPassword ? '🙈' : '👁️'}
          </button>
        }
      />

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg font-medium hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading && (
          <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
        )}
        {isLoading ? 'Resetting...' : 'Reset Password'}
      </button>

      <button
        type="button"
        onClick={onBack}
        disabled={isLoading}
        className="w-full text-muted-foreground hover:text-foreground text-sm font-medium py-2 transition-colors disabled:opacity-50"
      >
        Back to OTP
      </button>
    </form>
  )
}
