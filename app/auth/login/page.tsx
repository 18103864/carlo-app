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
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
            <div className="w-full max-w-sm">
                <LoginForm />
            </div>
        </div>
    )
}

export default LoginPage