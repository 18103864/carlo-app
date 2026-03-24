'use server'
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/server"
import { getCurrentUser } from "../getCurrentUser"
import { createTaskSchema, updateTaskSchema, moveTaskSchema, reorderTasksSchema } from "@/lib/schemas/task"
import z from "zod"

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

    revalidatePath('/organization', 'layout')

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

    revalidatePath('/organization', 'layout')

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

    const { data: existingTask, error: fetchError } = await supabase
        .from('task')
        .select('section_id, sort_order')
        .eq('id', data.taskId)
        .single()

    if (fetchError || !existingTask) {
        return { error: true, message: 'Task not found' }
    }

    const sourceSectionId = existingTask.section_id
    const isMovingToNewSection = sourceSectionId !== data.targetSectionId

    if (isMovingToNewSection) {
        const { error: shiftDownError } = await supabase.rpc('shift_task_sort_orders', {
            p_section_id: sourceSectionId,
            p_start_order: existingTask.sort_order,
            p_direction: -1
        })

        if (shiftDownError) {
            console.error('Failed to shift source section tasks:', shiftDownError)
        }

        const { error: shiftUpError } = await supabase.rpc('shift_task_sort_orders', {
            p_section_id: data.targetSectionId,
            p_start_order: data.newSortOrder,
            p_direction: 1
        })

        if (shiftUpError) {
            console.error('Failed to shift target section tasks:', shiftUpError)
        }
    } else {
        const oldOrder = existingTask.sort_order
        const newOrder = data.newSortOrder

        if (oldOrder !== newOrder) {
            if (oldOrder < newOrder) {
                const { error } = await supabase
                    .from('task')
                    .update({ sort_order: supabase.rpc('decrement_sort_order') as unknown as number })
                    .eq('section_id', data.targetSectionId)
                    .gt('sort_order', oldOrder)
                    .lte('sort_order', newOrder)
                    .neq('id', data.taskId)

                if (error) {
                    const { data: tasksToUpdate } = await supabase
                        .from('task')
                        .select('id, sort_order')
                        .eq('section_id', data.targetSectionId)
                        .gt('sort_order', oldOrder)
                        .lte('sort_order', newOrder)
                        .neq('id', data.taskId)

                    if (tasksToUpdate) {
                        for (const task of tasksToUpdate) {
                            await supabase
                                .from('task')
                                .update({ sort_order: task.sort_order - 1 })
                                .eq('id', task.id)
                        }
                    }
                }
            } else {
                const { data: tasksToUpdate } = await supabase
                    .from('task')
                    .select('id, sort_order')
                    .eq('section_id', data.targetSectionId)
                    .gte('sort_order', newOrder)
                    .lt('sort_order', oldOrder)
                    .neq('id', data.taskId)

                if (tasksToUpdate) {
                    for (const task of tasksToUpdate) {
                        await supabase
                            .from('task')
                            .update({ sort_order: task.sort_order + 1 })
                            .eq('id', task.id)
                    }
                }
            }
        }
    }

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

    revalidatePath('/organization', 'layout')

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

    revalidatePath('/organization', 'layout')

    return { error: false, message: 'Tasks reordered successfully' }
}