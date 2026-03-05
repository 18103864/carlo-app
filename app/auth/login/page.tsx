import LoginForm from '@/components/auth/login-form'
import { getCurrentUser } from '@/lib/services/getCurrentUser'
import { GalleryVerticalEnd } from 'lucide-react'
import { redirect } from 'next/navigation'

const LoginPage = async () => {
    const user = await getCurrentUser()
    
    if(user){
        redirect('/')
    }
    
    return (
        <div className='bg-muted min-h-svh flex flex-col items-center justify-center gap-6 p-6 md:p-10'>
            <div className="flex w-full max-w-sm flex-col gap-6">
                <a href="#" className="flex items-center gap-2 self-center font-medium">
                    <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                        <GalleryVerticalEnd className="size-4" />
                    </div>
                    Carlo
                </a>
                <LoginForm />
            </div>
        </div>
    )
}

export default LoginPage