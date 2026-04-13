'use client'

import { useState, useRef, useEffect, useMemo, type FormEvent } from 'react'
import Link from 'next/link'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { SendHorizonal, ArrowLeft, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useOrg } from '@/context/org-context'
import { useAuth } from '@/context/auth-context'
import { sendMessage } from '@/lib/services/actions/chat'
import { useRealtimeChat } from '@/hooks/use-realtime-chat'
import type { ChatMessage } from '@/lib/types'
import type { Member } from '@/lib/types'
import AddMembersDialog from './add-members-dialog'

interface ChatViewProps {
    roomId: string
    roomName: string
    initialMessages: ChatMessage[]
    roomMembers: { member_id: string; role: string; user_profile: { id: string; name: string | null; image_url: string | null } }[]
    orgMembers: Member[]
}

function getInitials(name: string | null) {
    if (!name) return '?'
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

export default function ChatView({ roomId, roomName, initialMessages, roomMembers, orgMembers }: ChatViewProps) {
    const { orgId } = useOrg()
    const { user, profile } = useAuth()
    const [messageInput, setMessageInput] = useState('')
    const [sending, setSending] = useState(false)
    const [localMessages, setLocalMessages] = useState<ChatMessage[]>([])
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const { connectedUsers, realtimeMessages, broadcast } = useRealtimeChat({
        userId: user?.id ?? '',
        roomId,
    })

    const messages = useMemo(() => {
        const combined = [...initialMessages, ...localMessages, ...realtimeMessages]
        const seen = new Set<string>()
        return combined
            .filter((m) => {
                if (seen.has(m.id)) return false
                seen.add(m.id)
                return true
            })
            .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    }, [initialMessages, localMessages, realtimeMessages])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages.length])

    useEffect(() => {
        setLocalMessages([])
        setMessageInput('')
    }, [roomId])

    const handleSend = async (e: FormEvent) => {
        e.preventDefault()
        const text = messageInput.trim()
        if (!text || sending) return

        setSending(true)
        setMessageInput('')

        const optimisticMsg: ChatMessage = {
            id: `temp-${Date.now()}`,
            chat_room_id: roomId,
            author_id: user?.id ?? '',
            text,
            created_at: new Date().toISOString(),
            author: {
                id: user?.id ?? '',
                name: profile?.name ?? null,
                image_url: profile?.image_url ?? null,
            },
        }

        setLocalMessages((prev) => [...prev, optimisticMsg])

        const result = await sendMessage({ chat_room_id: roomId, text })

        if (!result.error && result.data) {
            setLocalMessages((prev) =>
                prev.map((m) => (m.id === optimisticMsg.id ? result.data! : m))
            )
            broadcast(result.data)
        }

        setSending(false)
    }

    const nonMembers = orgMembers.filter(
        (om) => !roomMembers.some((rm) => rm.member_id === om.member_id)
    )

    return (
        <section className="flex flex-1 flex-col min-w-0 bg-background">
            <div className="flex items-center gap-3 border-b px-4 h-14 shrink-0">
                <Link
                    href={`/organization/${orgId}/inbox`}
                    className="md:hidden size-8 flex items-center justify-center rounded-md text-muted-foreground hover:bg-accent transition-colors"
                >
                    <ArrowLeft className="size-4" />
                </Link>
                <Avatar>
                    <AvatarFallback className="text-xs font-medium">
                        {getInitials(roomName)}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{roomName}</p>
                    <p className="text-xs text-muted-foreground">
                        {roomMembers.length} member{roomMembers.length !== 1 ? 's' : ''}
                        {connectedUsers > 1 && (
                            <span> &middot; {connectedUsers} online</span>
                        )}
                    </p>
                </div>
                {nonMembers.length > 0 && (
                    <AddMembersDialog
                        chatRoomId={roomId}
                        availableMembers={nonMembers}
                    />
                )}
            </div>

            <div className="flex-1 overflow-y-auto px-4 md:px-10 lg:px-16 py-6 space-y-3">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <Users className="size-10 text-muted-foreground/50 mb-3" />
                        <p className="text-sm text-muted-foreground">
                            No messages yet. Start the conversation!
                        </p>
                    </div>
                )}
                {messages.map((msg, i) => {
                    const isSent = msg.author_id === user?.id
                    const prev = messages[i - 1]
                    const showAvatar = !isSent && prev?.author_id !== msg.author_id

                    return (
                        <div
                            key={msg.id}
                            className={cn(
                                'flex items-end gap-2',
                                isSent ? 'justify-end' : 'justify-start'
                            )}
                        >
                            {!isSent && (
                                <div className="shrink-0 w-6">
                                    {showAvatar && (
                                        <Avatar size="sm">
                                            <AvatarFallback className="text-[9px] font-medium">
                                                {getInitials(msg.author?.name ?? null)}
                                            </AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                            )}
                            <div
                                className={cn(
                                    'max-w-[70%] md:max-w-[55%] rounded-2xl px-3.5 py-2',
                                    isSent
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted'
                                )}
                            >
                                {showAvatar && !isSent && (
                                    <p className="text-[10px] font-medium mb-0.5 text-muted-foreground">
                                        {msg.author?.name ?? 'Unknown'}
                                    </p>
                                )}
                                <p className="text-sm leading-relaxed">{msg.text}</p>
                                <p
                                    className={cn(
                                        'text-[10px] mt-1 text-right',
                                        isSent ? 'text-primary-foreground/60' : 'text-muted-foreground'
                                    )}
                                >
                                    {new Date(msg.created_at).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>
                        </div>
                    )
                })}
                <div ref={messagesEndRef} />
            </div>

            <div className="border-t px-4 py-3 shrink-0">
                <form onSubmit={handleSend} className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Write a message..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        className="flex-1 rounded-md border border-input bg-background px-3.5 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-[3px] focus:ring-ring/50 transition-shadow"
                    />
                    <button
                        type="submit"
                        disabled={!messageInput.trim() || sending}
                        className="size-9 flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:pointer-events-none transition-colors shrink-0"
                    >
                        <SendHorizonal className="size-4" />
                    </button>
                </form>
            </div>
        </section>
    )
}
