import ProfileForm from "@/components/profile/profile-form"
import { getCurrentUser } from "@/lib/services/getCurrentUser"
import { getProfile } from "@/lib/services/queries/profile"
import { notFound, redirect } from "next/navigation"

const ProfilePage = async () => {
    const user = await getCurrentUser()

    if (!user) {
        redirect('/auth/login')
    }

    const { data: profile } = await getProfile(user.id)

    if (!profile) {
        notFound()
    }

    return (
        <div className="min-h-screen-with-header max-w-7xl flex flex-col items-stretch px-6 mx-auto py-6 space-y-6">
            <div className="max-w-2xl mx-auto w-full">
                <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Manage your personal profile settings.
                </p>
            </div>
            <ProfileForm profile={profile} email={user.email || ''} />
        </div>
    )
}

export default ProfilePage
