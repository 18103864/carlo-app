export type Message = {
    id: string
    content: string
    timestamp: string
    sent: boolean
}

export type Conversation = {
    id: string
    name: string
    initials: string
    color: string
    lastMessage: string
    timestamp: string
    unreadCount: number
    online: boolean
    messages: Message[]
}

export const MOCK_CONVERSATIONS: Conversation[] = [
    {
        id: '1',
        name: 'Sarah Johnson',
        initials: 'SJ',
        color: 'bg-emerald-600 dark:bg-emerald-500',
        lastMessage: 'Sure, I\'ll send the report by EOD',
        timestamp: '2:45 PM',
        unreadCount: 2,
        online: true,
        messages: [
            { id: '1a', content: 'Hey! How\'s the project going?', timestamp: '2:30 PM', sent: false },
            { id: '1b', content: 'It\'s going well! Almost done with the frontend', timestamp: '2:32 PM', sent: true },
            { id: '1c', content: 'That\'s great to hear. Can you share the progress report?', timestamp: '2:35 PM', sent: false },
            { id: '1d', content: 'Sure thing, I\'ll compile it now', timestamp: '2:38 PM', sent: true },
            { id: '1e', content: 'Take your time, no rush', timestamp: '2:40 PM', sent: false },
            { id: '1f', content: 'Sure, I\'ll send the report by EOD', timestamp: '2:45 PM', sent: false },
        ],
    },
    {
        id: '2',
        name: 'Dev Team',
        initials: 'DT',
        color: 'bg-blue-600 dark:bg-blue-500',
        lastMessage: 'Alex: Deployed to staging',
        timestamp: '1:20 PM',
        unreadCount: 5,
        online: false,
        messages: [
            { id: '2a', content: 'Morning everyone! Sprint review at 10', timestamp: '9:00 AM', sent: false },
            { id: '2b', content: 'Got it, I\'ll prepare the demo', timestamp: '9:15 AM', sent: true },
            { id: '2c', content: 'Can we push it to 10:30? Still debugging an issue', timestamp: '9:30 AM', sent: false },
            { id: '2d', content: 'Works for me', timestamp: '9:32 AM', sent: true },
            { id: '2e', content: 'Fixed the bug, PR is up for review', timestamp: '12:45 PM', sent: false },
            { id: '2f', content: 'Alex: Deployed to staging', timestamp: '1:20 PM', sent: false },
        ],
    },
    {
        id: '3',
        name: 'Michael Chen',
        initials: 'MC',
        color: 'bg-violet-600 dark:bg-violet-500',
        lastMessage: 'Let me know when you\'re free for lunch',
        timestamp: '12:05 PM',
        unreadCount: 0,
        online: true,
        messages: [
            { id: '3a', content: 'Hey, are you coming to the team lunch?', timestamp: '11:30 AM', sent: false },
            { id: '3b', content: 'What time is it?', timestamp: '11:45 AM', sent: true },
            { id: '3c', content: 'Around 12:30, at the Italian place downtown', timestamp: '11:50 AM', sent: false },
            { id: '3d', content: 'Sounds good, count me in!', timestamp: '12:00 PM', sent: true },
            { id: '3e', content: 'Let me know when you\'re free for lunch', timestamp: '12:05 PM', sent: false },
        ],
    },
    {
        id: '4',
        name: 'Emily Davis',
        initials: 'ED',
        color: 'bg-rose-600 dark:bg-rose-500',
        lastMessage: 'The design mockups are ready for review',
        timestamp: '11:30 AM',
        unreadCount: 1,
        online: false,
        messages: [
            { id: '4a', content: 'Hi! I\'ve been working on the new dashboard design', timestamp: '10:00 AM', sent: false },
            { id: '4b', content: 'Can\'t wait to see it!', timestamp: '10:05 AM', sent: true },
            { id: '4c', content: 'I\'ll share the Figma link in a bit', timestamp: '10:15 AM', sent: false },
            { id: '4d', content: 'The design mockups are ready for review', timestamp: '11:30 AM', sent: false },
        ],
    },
    {
        id: '5',
        name: 'Product Team',
        initials: 'PT',
        color: 'bg-amber-600 dark:bg-amber-500',
        lastMessage: 'You: I\'ll update the roadmap today',
        timestamp: 'Yesterday',
        unreadCount: 0,
        online: false,
        messages: [
            { id: '5a', content: 'Q2 planning starts next week', timestamp: 'Yesterday', sent: false },
            { id: '5b', content: 'Do we have the updated requirements?', timestamp: 'Yesterday', sent: false },
            { id: '5c', content: 'I\'ll update the roadmap today', timestamp: 'Yesterday', sent: true },
        ],
    },
    {
        id: '6',
        name: 'James Wilson',
        initials: 'JW',
        color: 'bg-cyan-600 dark:bg-cyan-500',
        lastMessage: 'Thanks for the code review!',
        timestamp: 'Yesterday',
        unreadCount: 0,
        online: false,
        messages: [
            { id: '6a', content: 'Can you review my PR #342?', timestamp: 'Yesterday', sent: false },
            { id: '6b', content: 'Sure, looking at it now', timestamp: 'Yesterday', sent: true },
            { id: '6c', content: 'Left a few comments, mostly minor stuff', timestamp: 'Yesterday', sent: true },
            { id: '6d', content: 'Thanks for the code review!', timestamp: 'Yesterday', sent: false },
        ],
    },
    {
        id: '7',
        name: 'Lisa Park',
        initials: 'LP',
        color: 'bg-pink-600 dark:bg-pink-500',
        lastMessage: 'See you at the conference next week!',
        timestamp: 'Monday',
        unreadCount: 0,
        online: true,
        messages: [
            { id: '7a', content: 'Are you attending the React Summit?', timestamp: 'Monday', sent: false },
            { id: '7b', content: 'Yes! Already got my ticket', timestamp: 'Monday', sent: true },
            { id: '7c', content: 'See you at the conference next week!', timestamp: 'Monday', sent: false },
        ],
    },
]
