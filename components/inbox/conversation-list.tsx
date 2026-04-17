'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Search } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import { useOrg } from '@/context/org-context'
import { supabase } from '@/lib/client'
import CreateRoomDialog from './create-room-dialog'
import type { ChatRoomWithLatest, Member } from '@/lib/types'

interface ConversationListProps {
    rooms: ChatRoomWithLatest[]
    members: Member[]
}

function getInitials(name: string) {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

function sortRooms(list: ChatRoomWithLatest[]) {
    return [...list].sort((a, b) => {
        const aTime = a.latest_message?.created_at ?? a.created_at
        const bTime = b.latest_message?.created_at ?? b.created_at
        return new Date(bTime).getTime() - new Date(aTime).getTime()
    })
}

export default function ConversationList({ rooms, members }: ConversationListProps) {
    const [search, setSearch] = useState('')
    const [liveRooms, setLiveRooms] = useState<ChatRoomWithLatest[]>(sortRooms(rooms))
    const { roomId } = useParams<{ roomId?: string }>()
    const { orgId } = useOrg()

    useEffect(() => {
        setLiveRooms(sortRooms(rooms))
    }, [rooms])

    useEffect(() => {
        if (!orgId) return

        const channel = supabase.channel(`org:${orgId}:conversation-list`, {
            config: {
                broadcast: {
                    self: true,
                },
            },
        })

        channel
            .on('broadcast', { event: 'MESSAGE_CREATED' }, (payload) => {
                const incoming = payload.payload as {
                    roomId: string
                    message: {
                        id: string
                        chat_room_id: string
                        text: string
                        created_at: string
                        author_id: string
                        author?: {
                            id: string
                            name: string | null
                            image_url: string | null
                        }
                    }
                }

                setLiveRooms((prev) => {
                    const index = prev.findIndex((room) => room.id === incoming.roomId)
                    if (index === -1) return prev

                    const next = [...prev]
                    next[index] = {
                        ...next[index],
                        latest_message: {
                            text: incoming.message.text,
                            created_at: incoming.message.created_at,
                            author: incoming.message.author
                                ? {
                                      id: incoming.message.author.id,
                                      name: incoming.message.author.name,
                                  }
                                : null,
                        },
                    }

                    return sortRooms(next)
                })
            })
            .subscribe()

        return () => {
            channel.unsubscribe()
        }
    }, [orgId])

    const filtered = useMemo(() => {
        return liveRooms.filter((room) =>
            room.name.toLowerCase().includes(search.toLowerCase())
        )
    }, [liveRooms, search])

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
                        {liveRooms.length === 0 ? 'No conversations yet' : 'No results found'}
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
                                    <span className="text-[11px] text-muted-foreground shrink-0">
                                        {time}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground truncate mt-0.5">
                                    {preview}
                                </p>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </aside>
    )
}