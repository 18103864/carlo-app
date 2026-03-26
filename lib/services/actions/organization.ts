'use server'

import { getCurrentUser } from "../getCurrentUser"
import { createOrganizationSchema } from "@/lib/schemas/organizations"
import { createClient } from "@/lib/server"
import z from "zod"

export async function createOrganization(unsafeData: z.infer<typeof createOrganizationSchema>) {
    const {success, data} = createOrganizationSchema.safeParse(unsafeData)
    const user = await getCurrentUser()

    const supabase = await createClient()

    if(!success){
        return {error: true, message: "Invalid organization data"}
    }

    if(!user) {
        return { error: true, message: 'User is not authenticated'}
    }

    
    const {data: organization, error} = await supabase
        .from('organization')
        .insert({
            name: data.name,
            owner_id: user.id,
        })
        .select()
        .single()

    if(error) {
        return { error: true, message: `Failed to create organization: ${error.message}`}
    }
    
    return { error: false, organization}
}