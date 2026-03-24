import z from "zod";

export const createBoardSchema = z.object({
    title: z.string().trim().min(1, { message: 'Board title is required' }),
    org_id: z.string().trim().min(1, { message: 'Organization ID is required' }),
    description: z.string().trim().optional(),
})

export const updateBoardSchema = z.object({
    title: z.string().trim().min(1, { message: 'Board title is required' }),
    description: z.string().trim().optional(),
})