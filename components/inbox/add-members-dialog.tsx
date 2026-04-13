'use client'

import { useState, useTransition } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { UserPlus, Search, Check } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { addChatRoomMembers } from '@/lib/services/actions/chat'
import { useRouter } from 'next/navigation'
import type { Member } from '@/lib/types'

interface AddMembersDialogProps {
    chatRoomId: string
    availableMembers: Member[]
}

function getInitials(name: string | null) {
    if (!name) return '?'
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

export default function AddMembersDialog({ chatRoomId, availableMembers }: AddMembersDialogProps) {
    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState<string[]>([])
    const [search, setSearch] = useState('')
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const filtered = availableMembers.filter((m) =>
        m.user_profile.name?.toLowerCase().includes(search.toLowerCase())
    )

    function toggleMember(id: string) {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        )
    }

    async function handleSubmit() {
        if (selected.length === 0) return

        startTransition(async () => {
            const result = await addChatRoomMembers({
                chat_room_id: chatRoomId,
                member_ids: selected,
            })

            if (!result.error) {
                setOpen(false)
                setSelected([])
                setSearch('')
                router.refresh()
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={(next) => {
            setOpen(next)
            if (!next) {
                setSelected([])
                setSearch('')
            }
        }}>
            <DialogTrigger asChild>
                <button className="size-8 flex items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                    <UserPlus className="size-4" />
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add members</DialogTitle>
                    <DialogDescription>
                        Add organization members to this conversation.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                        <Input
                            placeholder="Search members..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    <div className="max-h-60 overflow-y-auto rounded-md border">
                        {filtered.length === 0 ? (
                            <p className="text-sm text-muted-foreground p-3 text-center">
                                No members found
                            </p>
                        ) : (
                            filtered.map((member) => {
                                const isSelected = selected.includes(member.member_id)
                                return (
                                    <button
                                        key={member.member_id}
                                        type="button"
                                        onClick={() => toggleMember(member.member_id)}
                                        className={cn(
                                            'flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-accent',
                                            isSelected && 'bg-accent/50'
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
                                            isSelected
                                                ? 'bg-primary border-primary text-primary-foreground'
                                                : 'border-input'
                                        )}>
                                            {isSelected && <Check className="size-3" />}
                                        </div>
                                    </button>
                                )
                            })
                        )}
                    </div>

                    {selected.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                            {selected.length} member{selected.length > 1 ? 's' : ''} selected
                        </p>
                    )}
                </div>

                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={isPending || selected.length === 0}>
                        {isPending ? 'Adding...' : `Add member${selected.length > 1 ? 's' : ''}`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
