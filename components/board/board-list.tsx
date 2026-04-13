'use client'
import { createContext, Suspense, use, useContext, useOptimistic, startTransition, useState, useEffect } from 'react'
import { Board, Organization } from '@/lib/types'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardTitle } from '../ui/card'
import BoardHeader from './board-header'
import BoardsListLoader from './board-list-loader'
import { formatDate } from '@/lib/utils'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '../ui/empty'
import { Presentation } from 'lucide-react'
import { createClient } from '@/lib/client'

type BoardsResponse = {
    error: boolean
    message?: string
    data?: Board[]
}

type BoardContextType = {
    optimisticBoards: Board[]
    addOptimisticBoard: (board: Board) => void
    orgId: string
}

const BoardContext = createContext<BoardContextType | null>(null)

function useBoardContext() {
    const context = useContext(BoardContext)
    if (!context) {
        throw new Error('useBoardContext must be used within BoardProvider')
    }
    return context
}

function BoardListContent() {
    const { optimisticBoards, orgId } = useBoardContext()

    if (optimisticBoards.length === 0) {
        return (
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <Presentation strokeWidth={1}/>
                    </EmptyMedia>
                    <EmptyTitle>No Boards Yet</EmptyTitle>
                    <EmptyDescription>
                        You haven&apos;t created any boards yet. Get started by creating
                        your first board.
                    </EmptyDescription>
                </EmptyHeader>
            </Empty>
        )
    }

    return (
        <div className='gap-4 p-4 lg:px-10 grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))]'>
            {optimisticBoards.map((board) => (
                <Link 
                    href={`/organization/${orgId}/board/${board.id}`} 
                    key={board.id}
                    className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs'
                >
                    <Card className="@container/card rounded-md py-4 hover:border-primary h-24 justify-center">
                        <CardContent className='flex items-center gap-2 px-4'>
                            <div className='rounded-full bg-primary dark:bg-accent text-primary-foreground min-w-10 min-h-10 flex justify-center items-center'>
                                <Presentation strokeWidth={1.5} size={16}/>
                            </div>
                            <div>
                                <CardTitle className="text-sm font-semibold tabular-nums">
                                    {board.title}
                                </CardTitle>
                                <span className="line-clamp-1 text-xs whitespace-break-spaces">
                                    {board.description}
                                </span>
                                <CardDescription className='text-xs font-medium space-x-1 flex items-center'>
                                    <span>
                                        {board.creator_name ?? 'Unknown'}
                                    </span>
                                    <span>○</span>
                                    <span>
                                        {formatDate(board.created_at)}
                                    </span>
                                </CardDescription>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    )
}

function BoardListWithData({ 
    boardsPromise,
    organization,
}: { 
    boardsPromise: Promise<BoardsResponse>
    organization: Organization
}) {
    const { data: serverBoards } = use(boardsPromise)
    const [boards, setBoards] = useState<Board[]>(serverBoards || [])

    useEffect(() => {
        setBoards(serverBoards || [])
    }, [serverBoards])

    const [optimisticBoards, addOptimisticBoard] = useOptimistic(
        boards,
        (state, newBoard: Board) => 
            state.some(b => b.id === newBoard.id) ? state : [newBoard, ...state]
    )

    useEffect(() => {
        const supabase = createClient()

        const channel = supabase
            .channel(`boards:${organization.id}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'board',
                filter: `org_id=eq.${organization.id}`
            }, async () => {
                const { data, error } = await supabase
                    .from('board')
                    .select('*, user_profile:creator_id(name)')
                    .eq('org_id', organization.id)
                    .order('created_at', { ascending: false })

                if (!error && data) {
                    setBoards(data.map(b => ({
                        ...b,
                        creator_name: (b.user_profile as { name: string | null } | null)?.name,
                        user_profile: undefined,
                    })))
                }
            })
            .subscribe()

        return () => {
            channel.unsubscribe()
        }
    }, [organization.id])

    function handleBoardCreated(board: Board) {
        startTransition(() => {
            addOptimisticBoard(board)
        })
    }

    return (
        <BoardContext.Provider value={{ optimisticBoards, addOptimisticBoard, orgId: organization.id }}>
            <BoardHeader organization={organization} onBoardCreated={handleBoardCreated} />
            <BoardListContent />
        </BoardContext.Provider>
    )
}

function BoardHeaderSkeleton({ organization }: { organization: Organization }) {
    return <BoardHeader organization={organization} onBoardCreated={() => {}} />
}

const BoardList = ({
    organization,
    boardsPromise,
}: {
    organization: Organization
    boardsPromise: Promise<BoardsResponse>
}) => {
    return (
        <Suspense fallback={
            <>
                <BoardHeaderSkeleton organization={organization} />
                <BoardsListLoader />
            </>
        }>
            <BoardListWithData boardsPromise={boardsPromise} organization={organization} />
        </Suspense>
    )
}

export default BoardList