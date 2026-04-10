import ConversationList from '@/components/inbox/conversation-list'
import React from 'react'

const InboxLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex h-screen-with-header overflow-hidden">
            <ConversationList />
            {children}
        </div>
    )
}

export default InboxLayout
