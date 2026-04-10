import ChatView from '@/components/inbox/chat-view'

const RoomPage = async ({ params }: { params: Promise<{ roomId: string }> }) => {
    const { roomId } = await params

    return <ChatView roomId={roomId} />
}

export default RoomPage
