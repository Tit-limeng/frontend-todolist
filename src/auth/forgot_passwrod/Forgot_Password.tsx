
import { useState } from 'react'
import {Link} from 'react-router-dom'
import AuthLayout from '../../component/auth_layout'
import FormInput from '../../component/form_input'

interface FormData {
  email: string
}

interface FormErrors {
  email?: string
  submit?: string
}

export default function ForgotPasswordPage() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    })) ;
    
    if (errors.email) {
      setErrors(prev => ({
        ...prev,
        email: undefined,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    try {
      // Simulate sending reset email
      await new Promise(resolve => setTimeout(resolve, 1500))
      // In a real app, this would send a password reset email
      console.log('[v0] Password reset email sent to:', formData.email)
      setIsSubmitted(true)
    } catch (error) {
      setErrors({
        submit: 'Failed to send reset email. Please try again.',
      }) ;
      console.error('[v0] Error sending password reset email:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Reset password"
      description="Enter your email to receive password reset instructions"
    >
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-sm text-foreground">
              We&apos;ll send you an email with a link to reset your password.
            </p>
          </div>

          <FormInput
            id="email"
            name="email"
            type="email"
            label="Email address"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            autoComplete="email"
          />

          {errors.submit && (
            <div className="p-4 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 text-sm">
              {errors.submit}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.2" />
                  <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
                Sending...
              </>
            ) : (
              'Send reset link'
            )}
          </button>

          <p className="text-center text-sm text-muted-foreground">
            Remember your password?{' '}
            <Link
              to="/auth/login"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Check your email
            </h2>
            <p className="text-muted-foreground text-sm mb-4">
              We&apos;ve sent a password reset link to{' '}
              <span className="font-medium text-foreground">{formData.email}</span>
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Click the link in the email to reset your password. The link will expire in 1 hour.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-secondary/50">
            <p className="text-xs text-muted-foreground">
              <strong>Didn&apos;t receive the email?</strong> Check your spam folder or try again with a different email address.
            </p>
          </div>

          <button
            onClick={() => {
              setIsSubmitted(false)
              setFormData({ email: '' })
              setErrors({})
            }}
            className="w-full px-4 py-2 rounded-lg bg-secondary text-foreground font-medium hover:bg-secondary/80 transition-colors"
          >
            Try another email
          </button>

          <p className="text-center text-sm text-muted-foreground">
            <Link
              to="/auth/login"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Back to sign in
            </Link>
          </p>
        </div>
      )}
    </AuthLayout>
  )
}
