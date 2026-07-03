import { useEffect, useState } from 'react'
import { userData } from '../api/api'

interface UserProfileProps {
  username: string
  onProfileClick: () => void
}

export default function UserProfile({ username, onProfileClick }: UserProfileProps) {
  // Get initials from user name
  const [initials, setInitials] = useState('');

    useEffect(()=>{
      const getData = async () => {
      try {
        const data = await userData();
        console.log('Fetched user data:', data[0].username);
        setInitials(data[0].username
        .split(' ')
        .map(( username : string) => username[0])
        .join('')
        .toUpperCase()) ;

      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    } 
      getData();
    },[]) ;
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
        {username}
      </span>
    </button>
  )
}
