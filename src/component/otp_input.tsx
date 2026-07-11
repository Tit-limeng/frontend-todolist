
import { useEffect, useRef } from 'react'

interface OTPInputProps {
  value: string
  onChange: (value: string) => void
  length?: number
  isLoading?: boolean
  error?: string,
  onclick : ()=> void ,
}

export default function OTPInput({
  value,
  onChange,
  length = 6,
  isLoading = false,
  error,
  onclick ,
}: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus()
  }, [])

  const handleChange = (index: number, newValue: string) => {
    // Only allow digits
    if (!/^\d*$/.test(newValue)) return

    const newOTP = value.split('')
    newOTP[index] = newValue.slice(-1) // Get only last character
    const newOTPString = newOTP.join('')

    onChange(newOTPString)

    // Auto-focus next input if digit entered
    if (newValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      if (value[index]) {
        // If current field has value, clear it
        const newOTP = value.split('')
        newOTP[index] = ''
        onChange(newOTP.join(''))
      } else if (index > 0) {
        // If current field is empty, move to previous and clear
        inputRefs.current[index - 1]?.focus()
        const newOTP = value.split('')
        newOTP[index - 1] = ''
        onChange(newOTP.join(''))
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, length)
    
    if (/^\d+$/.test(pastedData)) {
      onChange(pastedData)
      // Focus last input
      inputRefs.current[Math.min(pastedData.length, length - 1)]?.focus()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-center sm:gap-3">
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[index] || ''}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={isLoading}
            className={`w-12 h-12 text-center text-lg font-semibold rounded-lg border-2 transition-all ${
              error && value.length === length
                ? 'border-destructive bg-destructive/5'
                : 'border-input bg-background'
            } focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:opacity-50 disabled:cursor-not-allowed`}
          />
        ))}
      </div>

      {error && value.length === length && (
        <p className="text-sm text-destructive text-center font-medium">{error}</p>
      )}

      <p className="text-sm text-muted-foreground text-center">
        We&apos;ve sent a 6-digit code to your email
      </p>
      <div className='flex justify-end items-center p-0'>
        <button onClick={onclick}>resend</button>
      </div>
    </div>
  )
}
