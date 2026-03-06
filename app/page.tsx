import { getProfile } from "@/lib/services/actions/profile";
import { getCurrentUser } from "@/lib/services/getCurrentUser";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";

export default async function Home(){
    const user = await getCurrentUser()

    if(!user){
        redirect('/auth/login')
    }

    const user_info = await getProfile(user.id)

    return (
        <div className="min-h-screen bg-linear-to-br from-background via-muted/30 to-primary/5 flex items-center justify-center p-4">
            {user_info.data.image_url ? 'empty' : 'null'}
            <div className="text-center space-y-4">
                <Loader2 className="w-8 h-8 animate-spin mx-auto" />
                <p className="text-muted-foreground">Loading...</p>
            </div>
        </div>
    )
}