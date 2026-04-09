'use client'

import { useState, useTransition } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { createInvitationSchema } from '@/lib/schemas/invitation'
import { createInvitation } from '@/lib/services/actions/invitation'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'

type FormData = z.infer<typeof createInvitationSchema>

interface InviteMemberDialogProps {
    organizationId: string
    children: React.ReactNode
}

const InviteMemberDialog = ({ organizationId, children }: InviteMemberDialogProps) => {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()

    const form = useForm<FormData>({
        resolver: zodResolver(createInvitationSchema),
        defaultValues: {
            email: '',
            role: 'member',
        },
    })

    function handleSubmit(data: FormData) {
        startTransition(async () => {
            const result = await createInvitation(organizationId, data)
            if (result.error) {
                form.setError('email', { message: result.message })
                return
            }
            form.reset()
            setOpen(false)
        })
    }

    return (
        <Dialog open={open} onOpenChange={(value) => {
            setOpen(value)
            if (!value) form.reset()
        }}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Invite Member</DialogTitle>
                    <DialogDescription>
                        Send an invitation to join your organization.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <Controller
                        control={form.control}
                        name="email"
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    {...field}
                                    id="email"
                                    type="email"
                                    placeholder="colleague@example.com"
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.error && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                    <Controller
                        control={form.control}
                        name="role"
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel htmlFor="role">Role</FieldLabel>
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger id="role" className="w-full">
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="member">Member</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                                {fieldState.error && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                    <DialogFooter>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="size-4 animate-spin" />
                                    <span>Sending...</span>
                                </div>
                            ) : 'Send Invitation'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default InviteMemberDialog
