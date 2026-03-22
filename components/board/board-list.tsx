'use client'
import { useOptimistic } from 'react'
import { Board, Organization } from '@/lib/types'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardTitle } from '../ui/card'
import BoardHeader from './board-header'
import { formatDate } from '@/lib/utils'

const BoardList = ({
    organization,
    boards,
    error,
    message,
}: {
    organization: Organization
    boards: Board[]
    error: boolean
    message?: string
}) => {
    const [optimisticBoards, addOptimisticBoard] = useOptimistic(
        boards,
        (state, newBoard: Board) => [newBoard, ...state]
    )

    function handleBoardCreated(board: Board) {
        addOptimisticBoard(board)
    }

    return (
        <>
            <BoardHeader organization={organization} onBoardCreated={handleBoardCreated} />
            <div className='gap-4 p-4 lg:px-10 grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))]'>
                {optimisticBoards.map((board) => (
                    <Link 
                        href={`/board/${board.id}`} 
                        key={board.id}
                        className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs'
                    >
                        <Card className="@container/card rounded-md py-4 hover:border-primary h-24 justify-center">
                            <CardContent className='flex items-center gap-2 px-4'>
                                <div className='rounded-full bg-primary dark:bg-accent text-primary-foreground min-w-10 min-h-10 flex justify-center items-center'>
                                    {board.title[0].toLocaleUpperCase()}
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
        </>
    )
}

export default BoardList