'use client'
import { useOptimistic, useState, useTransition } from 'react'
import { Section, Task } from '@/lib/types'
import CreateTaskForm from '../task/create-task-form'
import TaskEmpty from '../task/task-empty'
import { createTask } from '@/lib/services/actions/task'
import { createTaskSchema } from '@/lib/schemas/task'
import z from 'zod'
import TaskItem from '../task/task-item'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import UpdateSectionForm from './update-section-form'

interface SectionCardClientProps {
    section: Section
    initialTasks: Task[]
}

type FormData = z.infer<typeof createTaskSchema>

const SectionCardClient = ({ section, initialTasks }: SectionCardClientProps) => {
    const [isPending, startTransition] = useTransition()
    const [currentSection, setCurrentSection] = useState(section)
    const [optimisticTasks, addOptimisticTask] = useOptimistic(
        initialTasks,
        (state, newTask: Task) => [newTask, ...state]
    )

    const handleCreateTask = async (data: FormData) => {
        const optimisticTask: Task = {
            id: `optimistic-${Date.now()}`,
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

        startTransition(async () => {
            addOptimisticTask(optimisticTask)
            await createTask(data)
        })
    }

    return (
        <Card className='p-0 gap-0'>
            <div className='border-b px-6 py-4 flex justify-between items-center'>
                <h1 className='leading-none font-semibold flex items-center gap-1'>
                    {currentSection.title}
                    <Badge className='rounded-md bg-accent text-foreground'>
                        {optimisticTasks.length}
                    </Badge>
                </h1>
                <UpdateSectionForm 
                    section={currentSection}
                    onUpdate={setCurrentSection}
                />
            </div>
            <CardContent className='px-6 py-6 w-full h-full flex flex-col justify-between space-y-4'>
                {optimisticTasks.length === 0 ? (
                    <TaskEmpty />
                ) : (
                    optimisticTasks.map((task) => (
                        <TaskItem key={task.id} task={task} />
                    ))
                )}
                <CreateTaskForm 
                    sectionId={section.id} 
                    sortOrder={optimisticTasks.length}
                    onSubmit={handleCreateTask}
                    isPending={isPending}
                />
            </CardContent>
            
            
        </Card>
    )
}

export default SectionCardClient
