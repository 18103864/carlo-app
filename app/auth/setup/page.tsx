import ProfileSetupForm from '@/components/auth/profile-setup-form'
import { getCurrentUser } from '@/lib/services/getCurrentUser'

const SetupPage = async () => {
    const user = await getCurrentUser()
    console.log(`user: ${user}, id: ${user?.id}`)
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className='w-full max-w-sm'>
                <ProfileSetupForm />
            </div>
        </div>
    )
}

export default SetupPage