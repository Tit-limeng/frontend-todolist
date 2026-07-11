import { useState ,useEffect } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import AuthLayout from '../../component/auth_layout'
import FormInput from '../../component/form_input'
import { api } from '../../api/api';
import OTPInput from '../../component/otp_input'



interface FormData {
  otp : string ,
  username: string
  email: string
  password: string
}

interface FormErrors {
  otp?: string ,
  username?: string
  email?: string
  password?: string
  submit?: string
}

type OtpStep = ''|'otpStep' ; 

export default function RegisterPage() {
  const [formData, setFormData] = useState<FormData>({
    otp : '' ,
    username: '',
    email: '',
    password: '',
  }) ;
  
  const [step , setStep ] = useState<OtpStep>('') ;
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const emails =sessionStorage.getItem('email')
  const router = useNavigate();

  // const [params] = useSearchParams();
  

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.username) {
      newErrors.username = 'Username is required'
    } else if (formData.username.length < 2) {
      newErrors.username = 'Username must be at least 2 characters'
    }

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }


  // test 

//    const handleResetPassword = async (
//   password: string,
//   confirmPassword: string
// ) => {
//   if (password !== confirmPassword) {
//     setErrors({
//       confirmPassword: "Passwords do not match",
//     });
//     return;
//   }

//   setIsLoading(true);

//   try {
//     console.log("this is user id :" , id ,email) ;
//     const response = await api.patch(
//       `/user/forgot-password/updatePassword/${id}`,
//       {
//         password,
//         email ,
//       }
//     );

//     if (response.data) {
//       setErrors({});
//       setStep("success");
//       console.log('this is data response : ',response.data) ;
//     } else {
//       setErrors({
//         submit: response.data,
//       });
//     }
//   } catch (error : any) {
//     setErrors({
//       submit:
//         error?.response?.data?.message ||
//         "Failed to reset password.",
//     });
//     console.log(error) ;
//   } finally {
//     setIsLoading(false);
//   }
// };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)) ;
      const response = await api.post('/user/create' , formData) ;
      if (response.status === 201) {
      console.log('[v0] Registration successful:', response.data); ;
      setErrors({ submit: 'Registration successful! Redirecting...' }) ;
      const email = formData.email ;
 
      if (email) {
        sessionStorage.setItem("email", email);
      }
      setStep('otpStep') ;
    }
    } catch (error) {
      setErrors({
        submit: 'Registration failed. Please try again.',
      }) ;
       console.error('Registration error:', error) ;
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
        email: emails,
        otp: formData.otp
      });

      if (response.data) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log(response.data.data); 
        router('/auth/login', {replace : true}) ;

        // if (response.data.data.user_id != null) {
        //   setStep('reset-password');
        //   router(`/auth/forgot-password?email=${encodeURIComponent(formData.email)}&id=${response.data.data.user_id}`, { replace: true });
        // }
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

  const resendOtp = async () => {
    try {
      const response = await api.post(`/user/forgot-password`,{
        email : emails
      }) ;

      if ( response.data ) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log(response.data) ;

      }
    } catch  {
      setErrors({
        submit : 'Failed to send Otp , Please try again.' ,
      }) ;
    }
  }

  useEffect(()=>{
    if (emails != null) 
      return setStep('otpStep');
  } ,[emails])

// test
//     const handleResetPassword = async (
//   password: string,
//   confirmPassword: string
// ) => {
//   if (password !== confirmPassword) {
//     setErrors({
//       confirmPassword: "Passwords do not match",
//     });
//     return;
//   }

//   setIsLoading(true);

//   try {
//     console.log("this is user id :" , id ,email) ;
//     const response = await api.patch(
//       `/user/forgot-password/updatePassword/${id}`,
//       {
//         password,
//         email ,
//       }
//     );

//     if (response.data) {
//       setErrors({});
//       // setStep("success");
//       console.log('this is data response : ',response.data) ;
//     } else {
//       setErrors({
//         submit: response.data,
//       });
//     }
//   } catch (error : any) {
//     setErrors({
//       submit:
//         error?.response?.data?.message ||
//         "Failed to reset password.",
//     });
//     console.log(error) ;
//   } finally {
//     setIsLoading(false);
//   }
// };
  return (
    <AuthLayout
      title="Create account"
      description="Sign up to get started with TaskFlow"
    >
      { step === '' &&  (
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          id="username"
          name="username"
          type="text"
          label="Full name"
          placeholder="John Doe"
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
          autoComplete="username"
        />

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

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              className={`w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 pr-10 ${
                errors.password
                  ? 'border-destructive bg-destructive/5'
                  : 'border-border bg-card text-foreground hover:border-primary/50'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-4.753 4.753m7.657-1.62a.75.75 0 10-1.06-1.061M15.75 10.5h.008v.008h-.008v-.008z" />
                </svg>
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-destructive">{errors.password}</p>
          )}
          <p className="mt-2 text-xs text-muted-foreground">
            Password must be at least 8 characters with uppercase, lowercase, and number
          </p>
        </div>

        {errors.submit && (
          <div className={`p-4 rounded-lg text-sm ${
            errors.submit.includes('successful')
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-destructive/10 text-destructive border border-destructive/20'
          }`}>
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
              Creating account...
            </>
          ) : (
            'Sign up'
          )}
        </button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            to="/auth/login"
            className="text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </form>

      )}

    {step === 'otpStep' && (
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
              // setStep('email')
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
    </AuthLayout>
  )
}
