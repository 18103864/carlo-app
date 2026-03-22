import { createClient } from "@/lib/server"
import { getCurrentUser } from "../getCurrentUser"
import z from "zod"
import { createSectionSchema } from "@/lib/schemas/section"

export async function getSections(boardId: string) {
    const user = await getCurrentUser()

    if(!user) {
        return { error: true, message: 'User is not authenticated'}
    }

    if(!boardId.trim()) {
        return { error: true, message: 'Board ID cannot be empty'}
    }
    const supabase = await createClient()
    const {data, error} = await supabase
        .from('section')
        .select('*')
        .eq('board_id', boardId)

    if(error) {
        return { error: true, message: 'Failed to get sections'}
    }

    return { error: false, data}
}

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

    return { error: false, section}
}