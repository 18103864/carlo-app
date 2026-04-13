'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Search } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import { useOrg } from '@/context/org-context'
import CreateRoomDialog from './create-room-dialog'
import type { ChatRoomWithLatest, Member } from '@/lib/types'

interface ConversationListProps {
    rooms: ChatRoomWithLatest[]
    members: Member[]
}

function getInitials(name: string) {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

export default function ConversationList({ rooms, members }: ConversationListProps) {
    const [search, setSearch] = useState('')
    const { roomId } = useParams<{ roomId?: string }>()
    const { orgId } = useOrg()

    const filtered = rooms.filter((room) =>
        room.name.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <aside
            className={cn(
                'flex flex-col border-r bg-card w-full md:w-[360px] md:min-w-[300px] shrink-0',
                roomId ? 'hidden md:flex' : 'flex'
            )}
        >
            <div className="flex items-center justify-between px-4 h-14 shrink-0">
                <h1 className="text-lg font-semibold tracking-tight">Messages</h1>
                {orgId && <CreateRoomDialog orgId={orgId} members={members} />}
            </div>

            <div className="px-3 pb-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-md border border-input bg-background py-1.5 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-[3px] focus:ring-ring/50 transition-shadow"
                    />
                </div>
            </div>

            <Separator />

            <div className="flex-1 overflow-y-auto">
                {filtered.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">
                        {rooms.length === 0 ? 'No conversations yet' : 'No results found'}
                    </p>
                )}
                {filtered.map((room) => {
                    const lastMsg = room.latest_message
                    const preview = lastMsg
                        ? `${lastMsg.author?.name ?? 'Unknown'}: ${lastMsg.text}`
                        : 'No messages yet'
                    const time = lastMsg
                        ? formatDate(lastMsg.created_at)
                        : formatDate(room.created_at)

                    return (
                        <Link
                            key={room.id}
                            href={`/organization/${orgId}/inbox/${room.id}`}
                            className={cn(
                                'flex w-full items-center gap-3 px-4 py-3 text-left transition-colors border-l-2 border-l-transparent',
                                roomId === room.id
                                    ? 'bg-accent border-l-primary'
                                    : 'hover:bg-accent/50'
                            )}
                        >
                            <div className="relative shrink-0">
                                <Avatar>
                                    <AvatarFallback className="text-xs font-medium">
                                        {getInitials(room.name)}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-baseline justify-between gap-2">
                                    <span className="text-sm font-medium truncate">{room.name}</span>
                                    <span className="text-[11px] text-muted-foreground shrink-0">{time}</span>
                                </div>
                                <p className="text-xs text-muted-foreground truncate mt-0.5">{preview}</p>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </aside>
    )
}
