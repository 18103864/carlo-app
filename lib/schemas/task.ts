import z from "zod";

export const createTaskSchema = z.object({
    title: z.string().trim().min(1, { message: 'Task title is required' }),
    description: z.string().trim().optional(),
    section_id: z.string().trim().min(1, { message: 'Section ID is required' }),
    sort_order: z.number().min(0, { message: 'Sort order must be greater than or equal to 0' }),
    due_date: z.date().optional(),
    assignee_id: z.string().trim().optional(),
    priority: z.enum(['low', 'medium', 'high'], { message: 'Priority is required' }),
})

export const updateTaskSchema = z.object({
    title: z.string().trim().min(1, { message: 'Task title is required' }),
    description: z.string().trim().optional(),
    due_date: z.date().optional(),
    assignee_id: z.string().trim().optional(),
    priority: z.enum(['low', 'medium', 'high'], { message: 'Priority is required' }),
})