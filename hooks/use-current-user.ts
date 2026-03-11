import { createClient } from "@/lib/client";
import { getProfile } from "@/lib/services/actions/profile";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

type UserProfile = {
    id: string
    name: string
    image_url: string
    created_at: string
    updated_at: string
}

export function useCurrentUser (){
    const [user, setUser] = useState<User | null>(null)
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(true)

    useEffect(() => {
        const supabase = createClient()
        supabase.auth.getUser().then(({data}) => {
            setUser(data.user)
        }).finally(() => {
            setIsLoading(false)
        })

        const { data } = supabase.auth.onAuthStateChange((_, session) => {
            setUser(session?.user ?? null)
        })

        return () => {
            data.subscription.unsubscribe()
        }
    }, [])


    const fetchUserProfile = async () => {
        if(!user) return

        try {
            const { data, error } = await getProfile(user.id)
            if(error) throw error
            setUserProfile(data)
        } catch (error) {
            console.error(`Error fetching user profile: ${error}`)
        } finally {
            setIsLoadingProfile(false)
        }
    }
    setIsLoadingProfile(false)
    fetchUserProfile()

    return {
        user,
        isLoading,
        userProfile,
        isLoadingProfile
    }
}