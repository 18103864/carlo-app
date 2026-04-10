import z from "zod"

export const createInvitationSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, { message: "Email is required" })
        .email({ message: "Please enter a valid email address" }),
    role: z.enum(["member", "admin"], {
        message: "Role must be either member or admin",
    }),
})
