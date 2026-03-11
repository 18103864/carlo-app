'use client'
import Link from 'next/link'
import { ModeToggle } from './mode-toggle'
import { Button } from './ui/button'
import { Loader2, LogOut } from 'lucide-react'
import { Separator } from './ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useAuth } from '@/context/auth-context'

const Navbar = () => {
    const {profile, profileLoading, logout} = useAuth()
    return (
        <nav className='h-header flex shrink-0 sticky top-0 items-center border-b bg-neutral-300/20 dark:bg-neutral-600/20 backdrop-blur-[1px]'>
            <div className="flex items-center justify-between h-full pr-3 flex-1 overflow-x-auto gap-x-8 pl-4">
                <div className="flex items-center gap-2">
                    <Link href={'/'}>
                        <div className="font-bold text-primary">
                            Carlo
                        </div>
                    </Link>

                    <div className="flex gap-2">
                        <span className="font-normal">/</span>
                        <span className="font-medium">
                            Organizations
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <ModeToggle className="rounded-full"/>
                    <Separator
                        orientation="vertical"
                        className="mr-2 data-[orientation=vertical]:h-4"
                    />
                    <Button className='rounded-full' variant={'outline'} size={'icon-sm'}>
                        {profileLoading ? (
                            <Loader2 className='animate-spin' />
                        ) : (
                            <Avatar>
                                <AvatarImage src={profile?.image_url} />
                                <AvatarFallback className='bg-background border dark:bg-muted'>
                                    {profile?.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                        )}
                    </Button>
                    <Separator
                        orientation="vertical"
                        className="mr-2 data-[orientation=vertical]:h-4"
                    />
                    <Button 
                        className='rounded-full' 
                        variant={'outline'} 
                        size={'icon-sm'}
                        onClick={logout}
                    >
                        <LogOut />
                    </Button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar