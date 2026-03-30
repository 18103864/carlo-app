"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/client";
import { useRouter } from "next/navigation";

interface Profile {
    id: string;
    name: string;
    image_url: string;
    created_at: string;
    updated_at: string;
}

interface AuthContextType {
    user: User | null;
    profile: Profile | null;
    loading: boolean;
    profileLoading: boolean;
    refreshProfile: () => Promise<void>;
    logout: () => Promise<void>;
    setProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [profileLoading, setProfileLoading] = useState(true);

    const fetchProfile = async (userId: string) => {
        await supabase.auth.getSession();
        setProfileLoading(true);

        try {
            const { data, error } = await supabase
                .from("user_profile")
                .select("*")
                .eq("id", userId)
                .maybeSingle();

            if (error) throw error;

            setProfile(data ?? null);
        } catch (error) {
            console.error("Error fetching profile:", error);
            setProfile(null);
        } finally {
            setProfileLoading(false);
        }
    };

    const refreshProfile = async () => {
        if (!user) {
            setProfile(null);
            setProfileLoading(false);
            return;
        }
        await fetchProfile(user.id);
    };

    const logout = async () => {
        await supabase.auth.signOut()
        router.push('/auth/login')
    };

    useEffect(() => {
        let mounted = true;

        const init = async () => {
            try {
                const { data } = await supabase.auth.getUser();
                const currentUser = data.user ?? null;

                if (!mounted) return;

                setUser(currentUser);

                if (currentUser) {
                    await fetchProfile(currentUser.id);
                } else {
                    setProfile(null);
                    setProfileLoading(false);
                }
            } catch (error) {
                console.error("Error loading auth:", error);
                if (!mounted) return;
                setUser(null);
                setProfile(null);
                setProfileLoading(false);
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        init();

        const { data: listener } = supabase.auth.onAuthStateChange(async (_, session) => {
            const nextUser = session?.user ?? null;
            setUser(nextUser);

            if (!nextUser) {
                setProfile(null);
                setProfileLoading(false);
                return;
            }

            await fetchProfile(nextUser.id);
        });

        return () => {
            mounted = false;
            listener.subscription.unsubscribe();
        };
    }, []);

  return (
    <AuthContext.Provider
        value={{
            user,
            profile,
            loading,
            profileLoading,
            refreshProfile,
            logout,
            setProfile,
        }}
    >
        {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}