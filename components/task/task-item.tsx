'use client'
import { useEffect, useState } from 'react'
import { Task } from '@/lib/types'
import { Badge } from '../ui/badge'
import { cn } from '@/lib/utils'
import UpdateTaskForm from './update-task-form'

interface TaskItemProps {
    task: Task
}

const TaskItem = ({ task }: TaskItemProps) => {
    const [currentTask, setCurrentTask] = useState(task)

    useEffect(() => {
        setCurrentTask(task)
    }, [task])

    const isPending = currentTask.id.startsWith('optimistic-')

    return (
        <div 
            className={`border rounded-md p-2 flex flex-col gap-1.5 min-w-0 ${
                isPending ? 'opacity-60' : ''
            }`}
        >
            <div className='flex justify-between items-center'>
                <h2 className='font-semibold text-sm flex items-center gap-1'>
                    {currentTask.title}
                    <Badge 
                        className={cn(
                            'rounded-md text-foreground p-1 h-4 text-[10px]',
                            `${currentTask.priority === 'high' ? 'bg-red-200 text-red-500' : `${currentTask.priority === 'medium' ? 'bg-orange-200 text-orange-500' : 'bg-blue-200 text-blue-500'}`}`
                        )}
                    >
                        {currentTask.priority}
                    </Badge>
                </h2>
                {!isPending && (
                    <UpdateTaskForm 
                        task={currentTask}
                        onUpdate={setCurrentTask}
                    />
                )}
            </div>
            <span className='text-xs text-muted-foreground'>
                {currentTask.description}
            </span>
            <div className='min-w-0 flex flex-col gap-1'>
                <span className='block text-xs text-muted-foreground truncate text-ellipsis'>
                    {currentTask.creator_name ?? 'Unknown'} ● { 
                        new Date(currentTask.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })
                    }
                </span>
                <span className='block text-xs text-muted-foreground truncate text-ellipsis'>
                    {currentTask.assignee_name ? `Assigned to ${currentTask.assignee_name}` : 'Unassigned'} ● Due {
                        currentTask.due_date
                            ? new Date(currentTask.due_date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })
                            : 'Not set'
                    }
                </span>
            </div>
        </div>
    )
}

export default TaskItem
