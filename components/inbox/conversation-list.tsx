'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Search, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MOCK_CONVERSATIONS } from './mock-data'
import { useOrg } from '@/context/org-context'

export default function ConversationList() {
    const [search, setSearch] = useState('')
    const { roomId } = useParams<{ roomId?: string }>()
    const { orgId } = useOrg()

    const filtered = MOCK_CONVERSATIONS.filter(
        (c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.lastMessage.toLowerCase().includes(search.toLowerCase())
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
                <button className="size-8 flex items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                    <Plus className="size-4" />
                </button>
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
                {filtered.map((conv) => (
                    <Link
                        key={conv.id}
                        href={`/organization/${orgId}/inbox/${conv.id}`}
                        className={cn(
                            'flex w-full items-center gap-3 px-4 py-3 text-left transition-colors border-l-2 border-l-transparent',
                            roomId === conv.id
                                ? 'bg-accent border-l-primary'
                                : 'hover:bg-accent/50'
                        )}
                    >
                        <div className="relative shrink-0">
                            <Avatar>
                                <AvatarFallback className={cn(conv.color, 'text-white text-xs font-medium')}>
                                    {conv.initials}
                                </AvatarFallback>
                            </Avatar>
                            {conv.online && (
                                <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-card bg-emerald-500" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-baseline justify-between gap-2">
                                <span className="text-sm font-medium truncate">{conv.name}</span>
                                <span className="text-[11px] text-muted-foreground shrink-0">{conv.timestamp}</span>
                            </div>
                            <div className="flex items-center justify-between gap-2 mt-0.5">
                                <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                                {conv.unreadCount > 0 && (
                                    <span className="flex shrink-0 items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                                        {conv.unreadCount}
                                    </span>
                                )}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </aside>
    )
}
