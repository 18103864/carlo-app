'use server'
import { createClient } from "@/lib/server"
import { getCurrentUser } from "../getCurrentUser"
import { createTaskSchema, updateTaskSchema, moveTaskSchema, reorderTasksSchema } from "@/lib/schemas/task"
import z from "zod"

export async function createTask(unsafeData: z.infer<typeof createTaskSchema>) {
    const {success, data} = createTaskSchema.safeParse(unsafeData)
    const user = await getCurrentUser()

    if(!user) {
        return { error: true, message: 'User is not authenticated'}
    }

    if(!success) {
        return { error: true, message: 'Invalid task data'}
    }

    const supabase = await createClient()
    const {data: task, error} = await supabase
        .from('task')
        .insert({
            title: data.title,
            description: data.description,
            section_id: data.section_id,
            sort_order: data.sort_order,
            creator_id: user.id,
            due_date: data.due_date,
            assignee_id: data.assignee_id || null,
            priority: data.priority,
        })
        .select('*, creator:creator_id(name), assignee:assignee_id(name)')
        .single()

    if(error) {
        return { error: true, message: `Failed to create task: ${error.message}`}
    }

    return { 
        error: false, 
        task: {
            ...task,
            creator_name: task.creator?.name,
            assignee_name: task.assignee?.name,
            creator: undefined,
            assignee: undefined,
        }
    }
}

export async function updateTask(id: string, unsafeData: z.infer<typeof updateTaskSchema>) {
    const { success, data } = updateTaskSchema.safeParse(unsafeData)
    const user = await getCurrentUser()

    if (!user) {
        return { error: true, message: 'User is not authenticated' }
    }

    if (!id.trim()) {
        return { error: true, message: 'Task ID cannot be empty' }
    }

    if (!success) {
        return { error: true, message: 'Invalid task data' }
    }

    const supabase = await createClient()

    const { data: task, error } = await supabase
        .from('task')
        .update({
            title: data.title,
            description: data.description,
            due_date: data.due_date,
            assignee_id: data.assignee_id || null,
            priority: data.priority,
        })
        .eq('id', id)
        .select('*, creator:creator_id(name), assignee:assignee_id(name)')
        .single()

    if (error) {
        return { error: true, message: 'Failed to update task' }
    }

    return { 
        error: false, 
        data: {
            ...task,
            creator_name: task.creator?.name,
            assignee_name: task.assignee?.name,
            creator: undefined,
            assignee: undefined,
        }
    }
}

export async function moveTask(unsafeData: z.infer<typeof moveTaskSchema>) {
    const { success, data } = moveTaskSchema.safeParse(unsafeData)
    const user = await getCurrentUser()

    if (!user) {
        return { error: true, message: 'User is not authenticated' }
    }

    if (!success) {
        return { error: true, message: 'Invalid move task data' }
    }

    const supabase = await createClient()

    const { data: task, error } = await supabase
        .from('task')
        .update({
            section_id: data.targetSectionId,
            sort_order: data.newSortOrder,
        })
        .eq('id', data.taskId)
        .select('*, creator:creator_id(name), assignee:assignee_id(name)')
        .single()

    if (error) {
        return { error: true, message: 'Failed to move task' }
    }

    return { 
        error: false, 
        data: {
            ...task,
            creator_name: task.creator?.name,
            assignee_name: task.assignee?.name,
            creator: undefined,
            assignee: undefined,
        }
    }
}

export async function reorderTasks(unsafeData: z.infer<typeof reorderTasksSchema>) {
    const { success, data } = reorderTasksSchema.safeParse(unsafeData)
    const user = await getCurrentUser()

    if (!user) {
        return { error: true, message: 'User is not authenticated' }
    }

    if (!success) {
        return { error: true, message: 'Invalid reorder data' }
    }

    const supabase = await createClient()

    const updates = data.taskIds.map((taskId, index) => ({
        id: taskId,
        sort_order: data.taskIds.length - 1 - index,
    }))

    for (const update of updates) {
        const { error } = await supabase
            .from('task')
            .update({ sort_order: update.sort_order })
            .eq('id', update.id)
            .eq('section_id', data.sectionId)

        if (error) {
            return { error: true, message: 'Failed to reorder tasks' }
        }
    }

    return { error: false, message: 'Tasks reordered successfully' }
}