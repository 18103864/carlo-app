'use server'

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/server"
import { getCurrentUser } from "../getCurrentUser"

import z from "zod"
import { createBoardSchema } from "@/lib/schemas/board"


export async function getBoards(orgId: string) {
    const user = await getCurrentUser()

    if(!user) {
        return { error: true, message: 'User is not authenticated'}
    }
    
    if(!orgId.trim()) {
        return { error: true, message: 'Organization ID cannot be empty'}
    }

    const supabase = await createClient()
    const {data, error} = await supabase
        .from('board')
        .select('*, user_profile:creator_id(name)')
        .eq('org_id', orgId)
    
    if(error) {
        return { error: true, message: 'Failed to get boards'}
    }

    const boards = data.map(board => ({
        ...board,
        creator_name: board.user_profile?.name,
        user_profile: undefined,
    }))

    return { error: false, data: boards}
}

export async function getBoardById(id: string) {
    const user = await getCurrentUser()

    if(!user) {
        return { error: true, message: 'User is not authenticated'}
    }
    
    if(!id.trim()) {
        return { error: true, message: 'Id cannot be empty'}
    }

    const supabase = await createClient()
    const {data, error} = await supabase
        .from('board')
        .select('*')
        .eq('id', id)
        .single()
    
    if(error) {
        return { error: true, message: 'Failed to get board'}
    }

    return { error: false, data}
}

export async function createBoard(unsafeData: z.infer<typeof createBoardSchema>) {
    const {success, data} = createBoardSchema.safeParse(unsafeData)
    const user = await getCurrentUser()

    if(!user) {
        return { error: true, message: 'User is not authenticated'}
    }
    
    if(!success) {
        return { error: true, message: 'Invalid board data'}
    }

    const supabase = await createClient()
    const {data: board, error} = await supabase
        .from('board')
        .insert({
            title: data.title,
            description: data.description,
            creator_id: user.id,
            org_id: data.org_id,
        })
        .select('*, user_profile:creator_id(name)')
        .single()
    
    if(error) {
        return { error: true, message: 'Failed to create board'}
    }

    revalidatePath(`/organization/${data.org_id}`)
    return { 
        error: false, 
        board: {
            ...board,
            creator_name: board.user_profile?.name,
            user_profile: undefined,
        }
    }
}