
import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import AuthLayout from '../../component/auth_layout'
import FormInput from '../../component/form_input'
import OTPInput from '../../component/otp_input'
import ResetPasswordForm from '../../component/reset-password-form'
import { api } from '../../api/api'

type Step = 'email' | 'otp' | 'reset-password' | 'success'

interface FormData {
  email: string
  otp: string
  password: string
  confirmPassword: string
}



interface FormErrors {
  otp?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  submit?: string;
}

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>('email');
  const router = useNavigate();
  const [param] = useSearchParams();
  const email = param.get('email');
  const id = param.get('id');

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
      const response = await api.post(`/user/forgot-password`, {
        email: formData.email
      });

      if (response.data) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        router(`/auth/forgot-password?email=${encodeURIComponent(formData.email)}`, { replace: true });
        console.log(response.data);
        // setFormData(response.data) ;
        setStep('otp')
        setErrors({})
      }
    } catch {
      setErrors({
        submit: 'Failed to send OTP. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }


  const resendOtp = async () => {

    setIsLoading(true)
    try {
      const response = await api.post(`/user/forgot-password`, {
        email: email
      });

      if (response.data) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        // router(`/auth/forgot-password?email=${encodeURIComponent(formData.email)}`, { replace: true });
        console.log(response.data);
        // setFormData(response.data) ;
        setStep('otp')
        setErrors({})
      }
    } catch {
      setErrors({
        submit: 'Failed to send OTP. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }
  const handleOTPVerify = async () => {
    // if (!formData.otp) {
    //   setErrors({
    //     otp: 'Invalid OTP. Try 123456 for demo.',
    //   })
    //   return
    // }

    setIsLoading(true)
    try {
      const response = await api.post(`/user/forgot-password/verify/`, {
        email: formData.email,
        otp: formData.otp
      });

      if (response.data) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log(response.data.data);

        if (response.data.data.user_id != null) {
          setStep('reset-password');
          router(`/auth/forgot-password?email=${encodeURIComponent(formData.email)}&id=${response.data.data.user_id}`, { replace: true });
        }
        setErrors({})

      }
    } catch (error) {
      setErrors({
        submit: 'Failed to verify OTP. Please try again.',
      });
      console.log(error);
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (
  password: string,
  confirmPassword: string
) => {
  if (password !== confirmPassword) {
    setErrors({
      confirmPassword: "Passwords do not match",
    });
    return;
  }

  setIsLoading(true);

  try {
    console.log("this is user id :" , id ,email) ;
    const response = await api.patch(
      `/user/forgot-password/updatePassword/${id}`,
      {
        password,
        email ,
      }
    );

    if (response.data) {
      setErrors({});
      setStep("success");
      console.log('this is data response : ',response.data) ;
    } else {
      setErrors({
        submit: response.data,
      });
    }
  } catch {
    setErrors({
      submit:
        // error?.response?.data?.message ||
        "Failed to reset password.",
    });
    // console.log(error) ;
  } finally {
    setIsLoading(false);
  }
};
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))

    if (errors.email) {
      setErrors(prev => ({
        ...prev,
        email: undefined,
      }))
    }
  }

  useEffect(() => {
    if (email != null && id != null) {
      setStep('reset-password');
      setErrors({})
    } else if ( email != null  ) {
      setStep('otp') ;
    }

  }, [email, id]);

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
            className={`h-1 flex-1 rounded-full transition-all ${['email', 'otp', 'reset-password', 'success'].indexOf(step) >= index
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
            onclick={resendOtp}
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

          {/* <div className="p-3 rounded-lg bg-secondary/50">
            <p className="text-xs text-muted-foreground text-center">
              <strong>Demo:</strong> Use OTP <span className="font-mono">123456</span>
            </p>
          </div> */}
        </div>
      )}

      {/* Step 3: Reset Password */}
      {step === 'reset-password' && (
        <ResetPasswordForm
          email={email}
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
