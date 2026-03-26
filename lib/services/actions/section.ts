'use server'

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/server"
import { getCurrentUser } from "../getCurrentUser"
import z from "zod"
import { createSectionSchema, updateSectionSchema } from "@/lib/schemas/section"

export async function createSection(unsafeData: z.infer<typeof createSectionSchema>) {
    const {success, data} = createSectionSchema.safeParse(unsafeData)
    const user = await getCurrentUser()

    if(!success) {
        return { error: true, message: 'Invalid section data'}
    }

    if(!user) {
        return { error: true, message: 'User is not authenticated'}
    }

    const supabase = await createClient()
    const {data: section, error} = await supabase
        .from('section')
        .insert({
            title: data.title,
            board_id: data.board_id,
            sort_order: data.sort_order,
            creator_id: user.id,
        })
        .select()
        .single()

    if(error) {
        return { error: true, message: 'Failed to create section'}
    }

    revalidatePath(`/board/${data.board_id}`)
    return { error: false, section}
}

export async function updateSection(id: string, unsafeData: z.infer<typeof updateSectionSchema>) {
    const { success, data } = updateSectionSchema.safeParse(unsafeData)
    const user = await getCurrentUser()

    if (!user) {
        return { error: true, message: 'User is not authenticated' }
    }

    if (!id.trim()) {
        return { error: true, message: 'Section ID cannot be empty' }
    }

    if (!success) {
        return { error: true, message: 'Invalid section data' }
    }

    const supabase = await createClient()

    const { data: existingSection, error: fetchError } = await supabase
        .from('section')
        .select('board_id')
        .eq('id', id)
        .single()

    if (fetchError || !existingSection) {
        return { error: true, message: 'Section not found' }
    }

    const { data: section, error } = await supabase
        .from('section')
        .update({
            title: data.title,
        })
        .eq('id', id)
        .select('*')
        .single()

    if (error) {
        return { error: true, message: 'Failed to update section' }
    }

    revalidatePath(`/board/${existingSection.board_id}`)
    return { error: false, data: section }
}