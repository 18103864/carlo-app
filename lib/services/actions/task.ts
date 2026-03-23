'use server'
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/server"
import { getCurrentUser } from "../getCurrentUser"
import { createTaskSchema } from "@/lib/schemas/task"
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
        .select()
        .single()

    if(error) {
        return { error: true, message: `Failed to create task: ${error.message}`}
    }

    revalidatePath('/organization', 'layout')

    return { error: false, task}
}