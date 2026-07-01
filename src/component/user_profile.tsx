interface UserProfileProps {
  userName: string
  onProfileClick: () => void
}

export default function UserProfile({ userName, onProfileClick }: UserProfileProps) {
  // Get initials from user name
  const initials = userName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()

  return (
    <button
      onClick={onProfileClick}
      className="flex items-center gap-3 rounded-lg hover:bg-secondary p-2 transition-colors cursor-pointer"
      title="Click to edit profile"
    >
      {/* Avatar with initials */}
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
        {initials}
      </div>
      {/* User name */}
      <span className="text-sm font-medium text-foreground hidden sm:inline">
        {userName}
      </span>
    </button>
  )
}
