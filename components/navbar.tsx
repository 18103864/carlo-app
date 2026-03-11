'use client'
import Link from 'next/link'
import { ModeToggle } from './mode-toggle'
import { Button } from './ui/button'
import { useCurrentUser } from '@/hooks/use-current-user'
import { User } from 'lucide-react'
import { Separator } from './ui/separator'

const Navbar = () => {
    const {user} = useCurrentUser()
    return (
        <nav className='h-header flex shrink-0 items-center border-b'>
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
                        <User />
                    </Button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar