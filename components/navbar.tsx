'use client'
import Link from 'next/link'
import { ModeToggle } from './mode-toggle'
import { Button } from './ui/button'
import { Bell, CreditCard, Loader2, LogOut, User } from 'lucide-react'
import { Separator } from './ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useAuth } from '@/context/auth-context'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'

const Navbar = () => {
    const {user, profile, profileLoading, logout} = useAuth()
    return (
        <nav className='h-header flex shrink-0 sticky top-0 items-center border-b '>
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
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button 
                                className='rounded-full data-[state=open]:ring' 
                                variant={'outline'} 
                                size={'icon-sm'}>
                                {profileLoading ? (
                                    <Loader2 className='animate-spin' />
                                ) : (
                                    <Avatar>
                                        <AvatarImage src={profile?.image_url} />
                                        <AvatarFallback>
                                            {profile?.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent 
                            align='end' 
                            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                            
                        >   
                            <DropdownMenuLabel className="p-0 font-normal">
                                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage src={profile?.image_url} alt={profile?.name} />
                                        <AvatarFallback className="rounded-full">
                                            {profile?.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-medium">{profile?.name}</span>
                                        <span className="truncate text-xs text-muted-foreground">
                                            {user?.email}
                                        </span>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <User />
                                    Account
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <CreditCard />
                                    Billing
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Bell />
                                    Notifications
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={logout}>
                                <LogOut />
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </nav>
    )
}

export default Navbar