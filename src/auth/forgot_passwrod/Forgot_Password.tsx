
import { useState } from 'react'
import {Link} from 'react-router-dom'
import AuthLayout from '../../component/auth_layout'
import FormInput from '../../component/form_input'
import OTPInput from '../../component/otp_input'
import ResetPasswordForm from '../../component/reset-password-form'

type Step = 'email' | 'otp' | 'reset-password' | 'success'

interface FormData {
  email: string
  otp: string
  password: string
  confirmPassword: string
}

interface FormErrors {
  email?: string
  otp?: string
  submit?: string
}

const MOCK_OTP = '123456'

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>('email')
  const [formData, setFormData] = useState<FormData>({
    email: '',
    otp: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateEmail = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateEmail()) {
      return
    }

    setIsLoading(true)
    try {
      // Simulate sending OTP
      await new Promise(resolve => setTimeout(resolve, 1500))
      setStep('otp')
      setErrors({})
    } catch (error) {
      setErrors({
        submit: 'Failed to send OTP. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOTPVerify = async () => {
    if (formData.otp !== MOCK_OTP) {
      setErrors({
        otp: 'Invalid OTP. Try 123456 for demo.',
      })
      return
    }

    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setStep('reset-password')
      setErrors({})
    } catch (error) {
      setErrors({
        submit: 'Failed to verify OTP. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (password: string, confirmPassword: string) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      console.log('[v0] Password reset successfully for:', formData.email)
      setStep('success')
      setErrors({})
    } catch (error) {
      setErrors({
        submit: 'Failed to reset password. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (errors.email) {
      setErrors(prev => ({
        ...prev,
        email: undefined,
      }))
    }
  }

  return (
    <AuthLayout
      title={
        step === 'email' ? 'Reset password' :
        step === 'otp' ? 'Verify OTP' :
        step === 'reset-password' ? 'Create new password' :
        'Password reset complete'
      }
      description={
        step === 'email' ? 'Enter your email to receive an OTP' :
        step === 'otp' ? 'Enter the 6-digit code sent to your email' :
        step === 'reset-password' ? 'Create a strong new password' :
        'Your password has been reset successfully'
      }
    >
      <div className="flex gap-2 mb-8">
        {(['email', 'otp', 'reset-password', 'success'] as const).map((s, index) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full transition-all ${
              ['email', 'otp', 'reset-password', 'success'].indexOf(step) >= index
                ? 'bg-primary'
                : 'bg-muted'
            }`}
          />
        ))}
      </div>

      {/* Step 1: Email */}
      {step === 'email' && (
        <form onSubmit={handleEmailSubmit} className="space-y-6">
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-sm text-foreground">
              We&apos;ll send you a 6-digit OTP to verify your identity.
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
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Sending OTP...
              </>
            ) : (
              'Send OTP'
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
      )}

      {/* Step 2: OTP Verification */}
      {step === 'otp' && (
        <div className="space-y-6">
          <OTPInput
            value={formData.otp}
            onChange={(otp) => {
              setFormData(prev => ({ ...prev, otp }))
              if (errors.otp) setErrors(prev => ({ ...prev, otp: undefined }))
            }}
            length={6}
            error={errors.otp}
            isLoading={isLoading}
          />

          {errors.submit && (
            <div className="p-4 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 text-sm">
              {errors.submit}
            </div>
          )}

          <button
            onClick={handleOTPVerify}
            disabled={isLoading || formData.otp.length !== 6}
            className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify OTP'
            )}
          </button>

          <button
            onClick={() => {
              setStep('email')
              setFormData(prev => ({ ...prev, otp: '' }))
              setErrors({})
            }}
            disabled={isLoading}
            className="w-full text-muted-foreground hover:text-foreground text-sm font-medium py-2 transition-colors disabled:opacity-50"
          >
            Back to email
          </button>

          <div className="p-3 rounded-lg bg-secondary/50">
            <p className="text-xs text-muted-foreground text-center">
              <strong>Demo:</strong> Use OTP <span className="font-mono">123456</span>
            </p>
          </div>
        </div>
      )}

      {/* Step 3: Reset Password */}
      {step === 'reset-password' && (
        <ResetPasswordForm
          email={formData.email}
          isLoading={isLoading}
          onSubmit={handleResetPassword}
          onBack={() => {
            setStep('otp')
            setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }))
          }}
        />
      )}


      {step === 'success' && (
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
              Password reset successfully
            </h2>
            <p className="text-muted-foreground text-sm">
              Your password has been changed. You can now sign in with your new password.
            </p>
          </div>

          <Link
            to="/auth/login"
            className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors text-center block"
          >
            Back to sign in
          </Link>
        </div>
      )}
    </AuthLayout>
  )
}
