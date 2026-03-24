'use client'
import { useCallback, useEffect, useOptimistic, useState, useTransition } from 'react'
import { Board, SectionWithTasks, Task } from '@/lib/types'
import { Separator } from '../ui/separator'
import SectionEmpty from './section-empty'
import CreateSectionForm from './create-section-form'
import UpdateBoardForm from '../board/update-board-form'
import { createSection } from '@/lib/services/actions/section'
import { createSectionSchema } from '@/lib/schemas/section'
import { createTaskSchema } from '@/lib/schemas/task'
import { createTask, moveTask, reorderTasks } from '@/lib/services/actions/task'
import z from 'zod'
import DroppableSection from './droppable-section'
import StaticSection from './static-section'
import TaskOverlay from '../task/task-overlay'
import { 
    DndContext, 
    DragEndEvent, 
    DragOverEvent, 
    DragOverlay, 
    DragStartEvent, 
    PointerSensor, 
    closestCorners, 
    useSensor, 
    useSensors 
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'

type SectionFormData = z.infer<typeof createSectionSchema>
type TaskFormData = z.infer<typeof createTaskSchema>

interface SectionGridClientProps {
    board: Board
    initialSections: SectionWithTasks[]
}

const SectionGridClient = ({ board, initialSections }: SectionGridClientProps) => {
    const [isPending, startTransition] = useTransition()
    const [currentBoard, setCurrentBoard] = useState(board)
    const [sections, setSections] = useState<SectionWithTasks[]>(initialSections)
    const [activeTask, setActiveTask] = useState<Task | null>(null)
    const [originalSectionId, setOriginalSectionId] = useState<string | null>(null)
    const [syncingTaskId, setSyncingTaskId] = useState<string | null>(null)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const [optimisticSections, addOptimisticSection] = useOptimistic(
        sections,
        (state, newSection: SectionWithTasks) => [...state, newSection]
    )

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    )

    const handleCreateSection = (data: SectionFormData) => {
        const optimisticSection: SectionWithTasks = {
            id: `optimistic-${Date.now()}`,
            title: data.title,
            board_id: data.board_id,
            creator_id: data.creator_id,
            sort_order: data.sort_order,
            created_at: new Date().toISOString(),
            tasks: [],
        }

        startTransition(async () => {
            addOptimisticSection(optimisticSection)
            await createSection(data)
        })
    }

    const handleCreateTask = useCallback((sectionId: string) => {
        return (data: TaskFormData) => {
            const optimisticId = `optimistic-${Date.now()}`
            const optimisticTask: Task = {
                id: optimisticId,
                title: data.title,
                description: data.description,
                section_id: data.section_id,
                sort_order: data.sort_order,
                creator_id: '',
                assignee_id: data.assignee_id,
                due_date: data.due_date?.toISOString(),
                priority: data.priority,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }

            setSections(prev => prev.map(section => 
                section.id === sectionId 
                    ? { ...section, tasks: [optimisticTask, ...section.tasks] }
                    : section
            ))

            startTransition(async () => {
                const result = await createTask(data)
                
                if (!result.error && result.task) {
                    const newTask: Task = {
                        id: result.task.id,
                        title: result.task.title,
                        description: result.task.description,
                        section_id: result.task.section_id,
                        sort_order: result.task.sort_order,
                        creator_id: result.task.creator_id,
                        creator_name: result.task.creator_name,
                        assignee_id: result.task.assignee_id,
                        assignee_name: result.task.assignee_name,
                        due_date: result.task.due_date,
                        priority: result.task.priority,
                        created_at: result.task.created_at,
                        updated_at: result.task.updated_at,
                    }
                    
                    setSections(prev => prev.map(section => 
                        section.id === sectionId 
                            ? { 
                                ...section, 
                                tasks: section.tasks.map(t => 
                                    t.id === optimisticId ? newTask : t
                                )
                            }
                            : section
                    ))
                } else {
                    setSections(prev => prev.map(section => 
                        section.id === sectionId 
                            ? { 
                                ...section, 
                                tasks: section.tasks.filter(t => t.id !== optimisticId)
                            }
                            : section
                    ))
                }
            })
        }
    }, [])

    const findSectionByTaskId = (taskId: string) => {
        return sections.find(section => 
            section.tasks.some(task => task.id === taskId)
        )
    }

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event
        const taskId = active.id as string
        
        const section = findSectionByTaskId(taskId)
        if (section) {
            setOriginalSectionId(section.id)
            const task = section.tasks.find(t => t.id === taskId)
            if (task) {
                setActiveTask(task)
            }
        }
    }

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event
        if (!over) return

        const activeId = active.id as string
        const overId = over.id as string

        const activeSection = findSectionByTaskId(activeId)
        if (!activeSection) return

        const overSection = findSectionByTaskId(overId) || 
            sections.find(s => s.id === overId)

        if (!overSection) return

        if (activeSection.id === overSection.id) {
            const activeIndex = activeSection.tasks.findIndex(t => t.id === activeId)
            const overIndex = activeSection.tasks.findIndex(t => t.id === overId)

            if (activeIndex !== overIndex && overIndex !== -1) {
                setSections(prev => prev.map(section => {
                    if (section.id !== activeSection.id) return section
                    
                    const newTasks = arrayMove(section.tasks, activeIndex, overIndex)
                    return { ...section, tasks: newTasks }
                }))
            }
        } else {
            const activeIndex = activeSection.tasks.findIndex(t => t.id === activeId)
            const activeTask = activeSection.tasks[activeIndex]
            
            if (!activeTask) return

            const overIndex = overSection.tasks.findIndex(t => t.id === overId)
            const insertIndex = overIndex === -1 ? overSection.tasks.length : overIndex

            setSections(prev => prev.map(section => {
                if (section.id === activeSection.id) {
                    return {
                        ...section,
                        tasks: section.tasks.filter(t => t.id !== activeId)
                    }
                }
                if (section.id === overSection.id) {
                    const newTasks = [...section.tasks]
                    const updatedTask = { ...activeTask, section_id: section.id }
                    newTasks.splice(insertIndex, 0, updatedTask)
                    return { ...section, tasks: newTasks }
                }
                return section
            }))
        }
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event
        setActiveTask(null)

        if (!over) {
            setOriginalSectionId(null)
            return
        }

        const activeId = active.id as string

        const currentSection = sections.find(section =>
            section.tasks.some(task => task.id === activeId)
        )

        if (!currentSection) {
            setOriginalSectionId(null)
            return
        }

        const currentTaskIndex = currentSection.tasks.findIndex(t => t.id === activeId)
        const isMovingToNewSection = originalSectionId !== null && originalSectionId !== currentSection.id

        const filterRealTaskIds = (tasks: Task[]) => 
            tasks.filter(t => !t.id.startsWith('optimistic-')).map(t => t.id)

        setSyncingTaskId(activeId)

        try {
            if (isMovingToNewSection) {
                const realTasks = currentSection.tasks.filter(t => !t.id.startsWith('optimistic-'))
                const newSortOrder = realTasks.length - 1 - currentTaskIndex
                
                await moveTask({
                    taskId: activeId,
                    targetSectionId: currentSection.id,
                    newSortOrder: Math.max(0, newSortOrder),
                })
                
                if (originalSectionId) {
                    const originalSection = sections.find(s => s.id === originalSectionId)
                    if (originalSection) {
                        const originalTaskIds = filterRealTaskIds(originalSection.tasks)
                        if (originalTaskIds.length > 0) {
                            await reorderTasks({
                                sectionId: originalSectionId,
                                taskIds: originalTaskIds,
                            })
                        }
                    }
                }
                
                const targetTaskIds = filterRealTaskIds(currentSection.tasks)
                if (targetTaskIds.length > 0) {
                    await reorderTasks({
                        sectionId: currentSection.id,
                        taskIds: targetTaskIds,
                    })
                }
            } else {
                const taskIds = filterRealTaskIds(currentSection.tasks)
                if (taskIds.length > 0) {
                    await reorderTasks({
                        sectionId: currentSection.id,
                        taskIds: taskIds,
                    })
                }
            }
        } finally {
            setSyncingTaskId(null)
        }

        setOriginalSectionId(null)
    }

    const newOptimisticSections = optimisticSections.filter(
        section => section.id.startsWith('optimistic-')
    )

    const existingSections = optimisticSections.filter(
        section => !section.id.startsWith('optimistic-')
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
            ) : !isMounted ? (
                <div className='mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-start'>
                    {existingSections.map((section) => (
                        <StaticSection
                            key={section.id}
                            section={section}
                            tasks={section.tasks}
                            onCreateTask={handleCreateTask(section.id)}
                            isPending={isPending}
                        />
                    ))}
                    {newOptimisticSections.map((section) => (
                        <StaticSection
                            key={section.id}
                            section={section}
                            tasks={section.tasks}
                            onCreateTask={handleCreateTask(section.id)}
                            isPending={isPending}
                        />
                    ))}
                </div>
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                >
                    <div className='mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-start'>
                        {existingSections.map((section) => (
                            <DroppableSection
                                key={section.id}
                                section={section}
                                tasks={section.tasks}
                                onCreateTask={handleCreateTask(section.id)}
                                isPending={isPending}
                                syncingTaskId={syncingTaskId}
                            />
                        ))}
                        {newOptimisticSections.map((section) => (
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
