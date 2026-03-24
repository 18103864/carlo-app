'use client'
import { useState } from 'react'
import { Section, Task } from '@/lib/types'
import CreateTaskForm from '../task/create-task-form'
import TaskEmpty from '../task/task-empty'
import { createTaskSchema } from '@/lib/schemas/task'
import z from 'zod'
import SortableTaskItem from '../task/sortable-task-item'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import UpdateSectionForm from './update-section-form'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

interface DroppableSectionProps {
    section: Section
    tasks: Task[]
    onCreateTask: (data: z.infer<typeof createTaskSchema>) => void
    isPending: boolean
    syncingTaskId?: string | null
}

const DroppableSection = ({ 
    section, 
    tasks, 
    onCreateTask, 
    isPending,
    syncingTaskId 
}: DroppableSectionProps) => {
    const [currentSection, setCurrentSection] = useState(section)
    
    const { setNodeRef, isOver } = useDroppable({
        id: section.id,
        data: {
            type: 'section',
            section,
        }
    })

    return (
        <div 
            ref={setNodeRef} 
            className={`h-fit rounded-xl transition-colors ${isOver ? 'ring-2 ring-primary ring-offset-2' : ''}`}
        >
            <Card className={`p-0 gap-0 ${isOver ? 'border-primary' : ''}`}>
                <div className='border-b px-6 py-4 flex justify-between items-center'>
                    <h1 className='leading-none font-semibold flex items-center gap-1'>
                        {currentSection.title}
                        <Badge className='rounded-md bg-accent text-foreground'>
                            {tasks.length}
                        </Badge>
                    </h1>
                    <UpdateSectionForm 
                        section={currentSection}
                        onUpdate={setCurrentSection}
                    />
                </div>
                <CardContent className='px-6 py-6 w-full h-full flex flex-col justify-between space-y-4'>
                    <SortableContext 
                        items={tasks.map(task => task.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {tasks.length === 0 ? (
                            <TaskEmpty />
                        ) : (
                            <div className='space-y-3'>
                                {tasks.map((task) => (
                                    <SortableTaskItem 
                                        key={task.id} 
                                        task={task} 
                                        isSyncing={syncingTaskId === task.id}
                                    />
                                ))}
                            </div>
                        )}
                    </SortableContext>
                    <CreateTaskForm 
                        sectionId={section.id} 
                        sortOrder={tasks.length}
                        onSubmit={onCreateTask}
                        isPending={isPending}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

export default DroppableSection
