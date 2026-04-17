'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Plus, Search, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createChatRoom } from '@/lib/services/actions/chat'
import { createChatRoomSchema } from '@/lib/schemas/chat'
import { useRouter } from 'nextjs-toploader/app'
import type { Member } from '@/lib/types'

type FormData = Pick<z.infer<typeof createChatRoomSchema>, 'name'>

interface CreateRoomDialogProps {
    orgId: string
    members: Member[]
}

export default function CreateRoomDialog({ orgId, members }: CreateRoomDialogProps) {
    const [open, setOpen] = useState(false)
    const [selectedMembers, setSelectedMembers] = useState<string[]>([])
    const [memberSearch, setMemberSearch] = useState('')
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const form = useForm<FormData>({
        resolver: zodResolver(createChatRoomSchema.pick({ name: true })),
        defaultValues: { name: '' },
    })

    const filteredMembers = members.filter((m) =>
        m.user_profile.name?.toLowerCase().includes(memberSearch.toLowerCase())
    )

    function toggleMember(memberId: string) {
        setSelectedMembers((prev) =>
            prev.includes(memberId)
                ? prev.filter((id) => id !== memberId)
                : [...prev, memberId]
        )
    }

    function getInitials(name: string | null) {
        if (!name) return '?'
        return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    }

    async function onSubmit(formData: FormData) {
        startTransition(async () => {
            const result = await createChatRoom({
                name: formData.name,
                org_id: orgId,
                member_ids: selectedMembers,
            })

            if (!result.error && result.data) {
                setOpen(false)
                form.reset()
                setSelectedMembers([])
                setMemberSearch('')
                router.push(`/organization/${orgId}/inbox/${result.data.id}`)
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={(next) => {
            setOpen(next)
            if (!next) {
                form.reset()
                setSelectedMembers([])
                setMemberSearch('')
            }
        }}>
            <DialogTrigger asChild>
                <button className="size-8 flex items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                    <Plus className="size-4" />
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New conversation</DialogTitle>
                    <DialogDescription>
                        Create a chat room and optionally add members.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <Field>
                        <FieldLabel>Room name</FieldLabel>
                        <Input
                            placeholder="e.g. Design Team"
                            {...form.register('name')}
                        />
                        {form.formState.errors.name && (
                            <FieldError>{form.formState.errors.name.message}</FieldError>
                        )}
                    </Field>

                    {members.length > 0 && (
                        <Field>
                            <FieldLabel>Add members</FieldLabel>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                                <Input
                                    placeholder="Search members..."
                                    value={memberSearch}
                                    onChange={(e) => setMemberSearch(e.target.value)}
                                    className="pl-9"
                                />
                            </div>

                            <div className="max-h-48 overflow-y-auto rounded-md border mt-2">
                                {filteredMembers.length === 0 ? (
                                    <p className="text-sm text-muted-foreground p-3 text-center">
                                        No members found
                                    </p>
                                ) : (
                                    filteredMembers.map((member) => {
                                        const selected = selectedMembers.includes(member.member_id)
                                        return (
                                            <button
                                                key={member.member_id}
                                                type="button"
                                                onClick={() => toggleMember(member.member_id)}
                                                className={cn(
                                                    'flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-accent',
                                                    selected && 'bg-accent/50'
                                                )}
                                            >
                                                <Avatar size="sm">
                                                    <AvatarFallback className="text-[9px] font-medium">
                                                        {getInitials(member.user_profile.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="flex-1 text-sm truncate">
                                                    {member.user_profile.name ?? 'Unknown'}
                                                </span>
                                                <div className={cn(
                                                    'size-5 rounded-md border flex items-center justify-center transition-colors',
                                                    selected
                                                        ? 'bg-primary border-primary text-primary-foreground'
                                                        : 'border-input'
                                                )}>
                                                    {selected && <Check className="size-3" />}
                                                </div>
                                            </button>
                                        )
                                    })
                                )}
                            </div>

                            {selectedMembers.length > 0 && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    {selectedMembers.length} member{selectedMembers.length > 1 ? 's' : ''} selected
                                </p>
                            )}
                        </Field>
                    )}

                    <DialogFooter>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? 'Creating...' : 'Create room'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
