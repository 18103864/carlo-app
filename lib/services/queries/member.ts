import { createClient } from "@/lib/server"
import { getCurrentUser } from "../getCurrentUser"

export async function getMembers(organizationId: string) {
    const user = await getCurrentUser()

    if (!user) {
        return { error: true, message: 'User is not authenticated' }
    }

    if (!organizationId.trim()) {
        return { error: true, message: 'Organization ID cannot be empty' }
    }

    const supabase = await createClient()
    const { data, error } = await supabase
        .from('organization_member')
        .select('*')
        .eq('org_id', organizationId)

    if (error) {
        return { error: true, message: 'Failed to get members' }
    }

    return { error: false, data }
}

