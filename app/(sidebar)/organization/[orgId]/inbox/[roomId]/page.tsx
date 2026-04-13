import ChatView from '@/components/inbox/chat-view'
import { getMessages, getChatRoom } from '@/lib/services/queries/chat'
import { getMembers } from '@/lib/services/queries/member'
import { notFound } from 'next/navigation'

const RoomPage = async ({ params }: { params: Promise<{ orgId: string; roomId: string }> }) => {
    const { orgId, roomId } = await params

    const [roomResult, messagesResult, membersResult] = await Promise.all([
        getChatRoom(roomId),
        getMessages(roomId),
        getMembers(orgId),
    ])

    if (roomResult.error || !roomResult.data) {
        notFound()
    }

    return (
        <ChatView
            roomId={roomId}
            roomName={roomResult.data.name}
            initialMessages={messagesResult.data ?? []}
            roomMembers={roomResult.data.members ?? []}
            orgMembers={membersResult.data ?? []}
        />
    )
}

export default RoomPage
