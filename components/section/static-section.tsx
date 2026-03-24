'use client'
import { useState } from 'react'
import { Section, Task } from '@/lib/types'
import CreateTaskForm from '../task/create-task-form'
import TaskEmpty from '../task/task-empty'
import { createTaskSchema } from '@/lib/schemas/task'
import z from 'zod'
import TaskItem from '../task/task-item'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import UpdateSectionForm from './update-section-form'

interface StaticSectionProps {
    section: Section
    tasks: Task[]
    onCreateTask: (data: z.infer<typeof createTaskSchema>) => void
    isPending: boolean
}

const StaticSection = ({ 
    section, 
    tasks, 
    onCreateTask, 
    isPending 
}: StaticSectionProps) => {
    const [currentSection, setCurrentSection] = useState(section)

    return (
        <div className='h-fit rounded-xl transition-colors'>
            <Card className='p-0 gap-0'>
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
                    {tasks.length === 0 ? (
                        <TaskEmpty />
                    ) : (
                        <div className='space-y-3'>
                            {tasks.map((task) => (
                                <TaskItem key={task.id} task={task} />
                            ))}
                        </div>
                    )}
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

export default StaticSection
