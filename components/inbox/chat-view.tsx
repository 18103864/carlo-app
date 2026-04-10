'use client'

import { useState, useRef, useEffect, type FormEvent } from 'react'
import Link from 'next/link'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { SendHorizonal, Ellipsis, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MOCK_CONVERSATIONS, type Message } from './mock-data'
import { useOrg } from '@/context/org-context'
import { notFound } from 'next/navigation'

interface ChatViewProps {
    roomId: string
}

export default function ChatView({ roomId }: ChatViewProps) {
    const { orgId } = useOrg()
    const conversation = MOCK_CONVERSATIONS.find((c) => c.id === roomId)

    if (!conversation) notFound()

    const [messages, setMessages] = useState(conversation.messages)
    const [messageInput, setMessageInput] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages.length])

    useEffect(() => {
        setMessages(conversation.messages)
        setMessageInput('')
    }, [roomId, conversation.messages])

    const handleSend = (e: FormEvent) => {
        e.preventDefault()
        if (!messageInput.trim()) return

        const newMessage: Message = {
            id: `${roomId}-${Date.now()}`,
            content: messageInput.trim(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sent: true,
        }

        setMessages((prev) => [...prev, newMessage])
        setMessageInput('')
    }

    return (
        <section className="flex flex-1 flex-col min-w-0 bg-background">
            {/* Header */}
            <div className="flex items-center gap-3 border-b px-4 h-14 shrink-0">
                <Link
                    href={`/organization/${orgId}/inbox`}
                    className="md:hidden size-8 flex items-center justify-center rounded-md text-muted-foreground hover:bg-accent transition-colors"
                >
                    <ArrowLeft className="size-4" />
                </Link>
                <Avatar>
                    <AvatarFallback className={cn(conversation.color, 'text-white text-xs font-medium')}>
                        {conversation.initials}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">{conversation.name}</p>
                        {conversation.online && (
                            <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {conversation.online ? 'Active now' : 'Offline'}
                    </p>
                </div>
                <button className="size-8 flex items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                    <Ellipsis className="size-4" />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 md:px-10 lg:px-16 py-6 space-y-3">
                {messages.map((msg, i) => {
                    const prev = messages[i - 1]
                    const showAvatar = !msg.sent && prev?.sent !== false

                    return (
                        <div
                            key={msg.id}
                            className={cn(
                                'flex items-end gap-2',
                                msg.sent ? 'justify-end' : 'justify-start'
                            )}
                        >
                            {!msg.sent && (
                                <div className="shrink-0 w-6">
                                    {showAvatar && (
                                        <Avatar size="sm">
                                            <AvatarFallback className={cn(conversation.color, 'text-white text-[9px] font-medium')}>
                                                {conversation.initials}
                                            </AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                            )}
                            <div
                                className={cn(
                                    'max-w-[70%] md:max-w-[55%] rounded-2xl px-3.5 py-2',
                                    msg.sent
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted'
                                )}
                            >
                                <p className="text-sm leading-relaxed">{msg.content}</p>
                                <p
                                    className={cn(
                                        'text-[10px] mt-1 text-right',
                                        msg.sent ? 'text-primary-foreground/60' : 'text-muted-foreground'
                                    )}
                                >
                                    {msg.timestamp}
                                </p>
                            </div>
                        </div>
                    )
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Compose */}
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
                        disabled={!messageInput.trim()}
                        className="size-9 flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:pointer-events-none transition-colors shrink-0"
                    >
                        <SendHorizonal className="size-4" />
                    </button>
                </form>
            </div>
        </section>
    )
}
