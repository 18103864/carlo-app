'use client'
import { ReactNode, useOptimistic, useState, useTransition } from 'react'
import { Board, Section } from '@/lib/types'
import { Separator } from '../ui/separator'
import SectionEmpty from './section-empty'
import SectionCardClient from './section-card-client'
import CreateSectionForm from './create-section-form'
import UpdateBoardForm from '../board/update-board-form'
import { createSection } from '@/lib/services/actions/section'
import { createSectionSchema } from '@/lib/schemas/section'
import z from 'zod'

type FormData = z.infer<typeof createSectionSchema>

interface SectionGridClientProps {
    board: Board
    initialSections: Section[]
    children: ReactNode
}

const SectionGridClient = ({ board, initialSections, children }: SectionGridClientProps) => {
    const [isPending, startTransition] = useTransition()
    const [currentBoard, setCurrentBoard] = useState(board)
    const [optimisticSections, addOptimisticSection] = useOptimistic(
        initialSections,
        (state, newSection: Section) => [...state, newSection]
    )

    const handleCreateSection = (data: FormData) => {
        const optimisticSection: Section = {
            id: `optimistic-${Date.now()}`,
            title: data.title,
            board_id: data.board_id,
            creator_id: data.creator_id,
            sort_order: data.sort_order,
            created_at: new Date().toISOString(),
        }

        startTransition(async () => {
            addOptimisticSection(optimisticSection)
            await createSection(data)
        })
    }

    const newOptimisticSections = optimisticSections.filter(
        section => section.id.startsWith('optimistic-')
    )

    return (
        <div className='w-full flex flex-col px-4 lg:px-10 py-6 flex-1 min-h-0'>
            <div className='w-full flex justify-between items-center'>
                <div className='flex items-center gap-2'>
                    <h1 className='text-4xl'>
                        {currentBoard?.title}
                    </h1>
                    <UpdateBoardForm 
                        board={currentBoard} 
                        onUpdate={setCurrentBoard}
                    />
                </div>
                
                <div className='flex items-center gap-x-6'>
                    <div className='flex flex-col gap-y-1'>
                        <span className='text-sm text-muted-foreground'>
                            Sections
                        </span>
                        <span className='text-2xl'>
                            {optimisticSections.length}
                        </span>
                    </div>
                    <Separator 
                        orientation="vertical"
                        className="data-[orientation=vertical]:h-5"
                    />
                    <CreateSectionForm
                        boardId={board.id}
                        creatorId={board.creator_id}
                        sortOrder={optimisticSections.length}
                        onSubmit={handleCreateSection}
                        isPending={isPending}
                    />
                </div>
            </div>
            {optimisticSections.length === 0 ? (
                <div className='flex items-center justify-center h-full'>
                    <SectionEmpty />
                </div>
            ) : (
                <div className='mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-start'>
                    {children}
                    {newOptimisticSections.map((section) => (
                        <SectionCardClient 
                            key={section.id} 
                            section={section} 
                            initialTasks={[]} 
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default SectionGridClient
