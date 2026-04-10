import { Inbox } from 'lucide-react'

const InboxPage = () => {
    return (
        <section className="hidden md:flex flex-1 flex-col items-center justify-center text-center px-6">
            <div className="rounded-xl bg-muted/60 p-5 mb-5">
                <Inbox className="size-10 text-muted-foreground/70" />
            </div>
            <h2 className="text-xl font-semibold tracking-tight mb-1">Your messages</h2>
            <p className="text-sm text-muted-foreground max-w-xs">
                Pick a conversation from the sidebar to start chatting with your team.
            </p>
        </section>
    )
}

export default InboxPage
