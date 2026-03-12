import z from "zod";

export const createOrganizationSchema = z.object({
    name: z.string().trim().min(1, { message: 'Organization name is required' }),
})