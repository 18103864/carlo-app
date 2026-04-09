import { createClient } from "@/lib/server"
import { getCurrentUser } from "../getCurrentUser"

export async function getInvitationsByOrg(organizationId: string) {
    const user = await getCurrentUser()

    if (!user) {
        return { error: true, message: 'User is not authenticated' }
    }

    if (!organizationId.trim()) {
        return { error: true, message: 'Organization ID cannot be empty' }
    }

    const supabase = await createClient()
    const { data, error } = await supabase
        .from('organization_invitation')
        .select('*, invited_by_profile:invited_by(id, name, image_url)')
        .eq('org_id', organizationId)
        .order('created_at', { ascending: false })

    if (error) {
        return { error: true, message: 'Failed to get invitations' }
    }

    return { error: false, data }
}

export async function getInvitationsByUser() {
    const user = await getCurrentUser()

    if (!user) {
        return { error: true, message: 'User is not authenticated' }
    }

    const supabase = await createClient()
    const { data, error } = await supabase
        .from('organization_invitation')
        .select('*, organization:org_id(id, name)')
        .eq('email', user.email!.toLowerCase())
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

    if (error) {
        return { error: true, message: 'Failed to get invitations' }
    }

    return { error: false, data }
}
