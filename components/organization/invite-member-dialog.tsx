'use client'

import { useRef, useState, useTransition } from 'react'
import { Loader2, Check } from 'lucide-react'
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
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { createInvitationSchema } from '@/lib/schemas/invitation'
import { createInvitation } from '@/lib/services/actions/invitation'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserProfile } from '@/lib/types'
import z from 'zod'

type FormData = z.infer<typeof createInvitationSchema>

interface InviteMemberDialogProps {
    organizationId: string
    profiles: UserProfile[]
    memberIds: string[]
    pendingInvitationEmails: string[]
    children: React.ReactNode
}

const InviteMemberDialog = ({
    organizationId,
    profiles,
    memberIds,
    pendingInvitationEmails,
    children,
}: InviteMemberDialogProps) => {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [showDropdown, setShowDropdown] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const memberIdSet = new Set(memberIds)
    const pendingEmailSet = new Set(pendingInvitationEmails)

    const form = useForm<FormData>({
        resolver: zodResolver(createInvitationSchema),
        defaultValues: {
            email: '',
            role: 'member',
        },
    })

    const emailValue = form.watch('email')

    const filteredProfiles = profiles.filter((profile) => {
        if (!profile.email) return false
        if (!emailValue) return true
        const query = emailValue.toLowerCase()
        return (
            profile.email.toLowerCase().includes(query) ||
            profile.name?.toLowerCase().includes(query)
        )
    })

    function getProfileStatus(profile: UserProfile) {
        if (memberIdSet.has(profile.id)) return 'member'
        if (profile.email && pendingEmailSet.has(profile.email.toLowerCase())) return 'pending'
        return 'available'
    }

    function handleSelectProfile(profile: UserProfile) {
        form.setValue('email', profile.email ?? '', { shouldValidate: true })
        setShowDropdown(false)
    }

    function handleSubmit(data: FormData) {
        const email = data.email.toLowerCase()
        const matchedProfile = profiles.find(
            (p) => p.email?.toLowerCase() === email
        )

        if (!matchedProfile) {
            form.setError('email', { message: 'User does not exist' })
            return
        }

        if (memberIdSet.has(matchedProfile.id)) {
            form.setError('email', { message: 'This user is already a member' })
            return
        }

        if (pendingEmailSet.has(email)) {
            form.setError('email', { message: 'An invitation is already pending for this user' })
            return
        }

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
            if (!value) {
                form.reset()
                setShowDropdown(false)
            }
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
                                <div className="relative">
                                    <Input
                                        {...field}
                                        ref={(e) => {
                                            field.ref(e)
                                            ;(inputRef as React.MutableRefObject<HTMLInputElement | null>).current = e
                                        }}
                                        id="email"
                                        type="email"
                                        placeholder="Search by name or email..."
                                        autoComplete="off"
                                        aria-invalid={fieldState.invalid}
                                        onFocus={() => setShowDropdown(true)}
                                        onBlur={() => {
                                            setTimeout(() => setShowDropdown(false), 200)
                                        }}
                                    />
                                    {showDropdown && emailValue && filteredProfiles.length > 0 && (
                                        <div className="absolute top-full left-0 z-50 mt-1 w-full max-h-52 overflow-y-auto rounded-md border bg-popover shadow-md">
                                            {filteredProfiles.map((profile) => {
                                                const status = getProfileStatus(profile)
                                                return (
                                                    <button
                                                        key={profile.id}
                                                        type="button"
                                                        className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-accent"
                                                        onMouseDown={(e) => {
                                                            e.preventDefault()
                                                            handleSelectProfile(profile)
                                                        }}
                                                    >
                                                        <Avatar size="sm">
                                                            <AvatarImage
                                                                src={profile.image_url ?? undefined}
                                                                alt={profile.name ?? 'User'}
                                                            />
                                                            <AvatarFallback>
                                                                {profile.name?.charAt(0).toUpperCase() ?? '?'}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium truncate">
                                                                {profile.name ?? 'Unnamed'}
                                                            </p>
                                                            <p className="text-muted-foreground text-xs truncate">
                                                                {profile.email}
                                                            </p>
                                                        </div>
                                                        {status === 'member' && (
                                                            <Badge variant="secondary" className="shrink-0 text-xs">
                                                                <Check className="size-3" />
                                                                Member
                                                            </Badge>
                                                        )}
                                                        {status === 'pending' && (
                                                            <Badge variant="outline" className="shrink-0 text-xs border-yellow-600/20 text-yellow-600 dark:border-yellow-500/20 dark:text-yellow-500">
                                                                Pending
                                                            </Badge>
                                                        )}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
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
