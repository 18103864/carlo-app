import { createClient } from "@/lib/server"
import { getCurrentUser } from "../getCurrentUser"

export async function getTasks(sectionId: string) {
    const user = await getCurrentUser()

    if(!user) {
        return { error: true, message: 'User is not authenticated'}
    }

    if(!sectionId.trim()) {
        return { error: true, message: 'Section ID cannot be empty'}
    }

    const supabase = await createClient()
    const {data, error} = await supabase
        .from('task')
        .select('*, creator:creator_id(name), assignee:assignee_id(name)')
        .eq('section_id', sectionId)
        .order('sort_order', { ascending: false })

    if(error) {
        return { error: true, message: 'Failed to get tasks'}
    }

    const tasks = data.map(task => ({
        ...task,
        creator_name: task.creator?.name,
        assignee_name: task.assignee?.name,
        creator: undefined,
        assignee: undefined,
    }))

    return { error: false, data: tasks}
}

export async function getTasksByBoardId(boardId: string) {
    const user = await getCurrentUser()

    if(!user) {
        return { error: true, message: 'User is not authenticated'}
    }

    if(!boardId.trim()) {
        return { error: true, message: 'Board ID cannot be empty'}
    }

    const supabase = await createClient()
    const {data, error} = await supabase
        .from('task')
        .select('*, creator:creator_id(name), assignee:assignee_id(name), section:section_id!inner(board_id)')
        .eq('section.board_id', boardId)
        .order('sort_order', { ascending: false })

    if(error) {
        return { error: true, message: 'Failed to get tasks'}
    }

    const tasks = data.map(task => ({
        ...task,
        creator_name: task.creator?.name,
        assignee_name: task.assignee?.name,
        creator: undefined,
        assignee: undefined,
        section: undefined,
    }))

    return { error: false, data: tasks}
}
