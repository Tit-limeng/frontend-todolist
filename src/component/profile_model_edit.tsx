
import { useEffect, useState } from 'react'

interface ProfileEditModalProps {
  isOpen: boolean
  username: string,
  password : string ,
  onSave: (newName: string, newPassword: string) => void
  onClose: () => void
}

export default function ProfileModalEdit({
  isOpen,
  username,
  password,
  onSave,
  onClose,
}: ProfileEditModalProps) {
  const [input, setInput] = useState({
    usernames: "",
    password : "" ,
  });
  // console.log('ProfileModalEdit rendered with username:', username);
  const [error, setError] = useState('')
  // const [edit , setEdit] = useState(username) ;

  const handleSave = () => {
    const trimmedName = input.usernames.trim();
    const trimmedPassword = input.password.trim();
    if (!trimmedName) {
      setError('Name cannot be empty')
      return
    }
    if (trimmedName.length < 2) {
      setError('Name must be at least 2 characters')
      return
    }

    if (!trimmedPassword) {
      setError('Password cannot be empty')
      return
    }
    if (trimmedPassword.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    onSave(trimmedName , trimmedPassword)
    setError('')
    setInput({ ...input, usernames: trimmedName })
    setInput({ ...input, password: password })
    onClose()
  }

  const handleClose = () => {
    setInput({ ...input, usernames: username })
    setInput({ ...input, password: password })
    setError('')
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      handleSave()
    } else if (e.key === 'Escape') {
      handleClose()
    }
  }


  useEffect(() => {
  // if (isOpen) {
    setInput({
      usernames: username,
      password: password,
    });
  // }
}, [isOpen, username, password]);
  if (!isOpen){
    return null  ;
  }

  

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-card p-6 shadow-lg border border-border">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Edit Profile
        </h2>

        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={input.usernames}
            onChange={(e) => {
              setInput({ ...input, usernames: e.target.value })
              setError('')
            }}
            onKeyDown={handleKeyDown}
            placeholder="Enter your name"
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            autoFocus
          />
          {error && (
            <p className="text-sm text-destructive mt-1">{error}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Password
          </label>
          <input
            type="text"
            value={input.password}
            onChange={(e) => {
              setInput({...input,password :e.target.value})
              setError('')
            }}
            onKeyDown={handleKeyDown}
            placeholder="Enter your name"
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            autoFocus
          />
          {error && (
            <p className="text-sm text-destructive mt-1">{error}</p>
          )}
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground font-medium hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
          >
            Save
          </button>
        </div>
      </div>
    </>
  )
}
