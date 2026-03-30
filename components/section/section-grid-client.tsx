'use client'
import { Board, SectionWithTasks } from '@/lib/types'
import { Separator } from '../ui/separator'
import SectionEmpty from './section-empty'
import CreateSectionForm from './create-section-form'
import UpdateBoardForm from '../board/update-board-form'
import DroppableSection from './droppable-section'
import SectionGridLoader from './section-grid-loader'
import TaskOverlay from '../task/task-overlay'
import { DndContext, DragOverlay, closestCorners } from '@dnd-kit/core'
import { useSectionGrid } from '@/hooks/use-section-grid'

interface SectionGridClientProps {
    board: Board
    initialSections: SectionWithTasks[]
}

const SectionGridClient = ({ board, initialSections }: SectionGridClientProps) => {
    const {
        currentBoard,
        setCurrentBoard,
        optimisticSections,
        isPending,
        isMounted,
        activeTask,
        syncingTaskId,
        sensors,
        handleCreateSection,
        handleCreateTask,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
    } = useSectionGrid(board, initialSections)

    return (
        <div className='w-full flex flex-col px-4 lg:px-10 py-6 flex-1 min-h-0'>
            <div className='w-full flex justify-between items-center'>
                <div className='flex items-baseline gap-2'>
                    <h1 className='text-4xl'>
                        {currentBoard?.title}
                    </h1>
                    <UpdateBoardForm 
                        board={currentBoard} 
                        onUpdate={setCurrentBoard}
                    />
                </div>
                
                <div className='hidden lg:flex items-center gap-x-6'>
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
            ) : !isMounted ? (
                <SectionGridLoader />
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                >
                    <div className='mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-start'>
                        {optimisticSections.map((section) => (
                            <DroppableSection
                                key={section.id}
                                section={section}
                                tasks={section.tasks}
                                onCreateTask={handleCreateTask(section.id)}
                                isPending={isPending}
                                syncingTaskId={syncingTaskId}
                            />
                        ))}
                    </div>
                    <DragOverlay>
                        {activeTask ? <TaskOverlay task={activeTask} /> : null}
                    </DragOverlay>
                </DndContext>
            )}
        </div>
    )
}

export default SectionGridClient
