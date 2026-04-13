'use client'
import { useEffect, useState } from 'react'
import { Task } from '@/lib/types'
import { Badge } from '../ui/badge'
import { cn } from '@/lib/utils'
import UpdateTaskForm from './update-task-form'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface SortableTaskItemProps {
    task: Task
    isSyncing?: boolean
}

const SortableTaskItem = ({ task, isSyncing }: SortableTaskItemProps) => {
    const [currentTask, setCurrentTask] = useState(task)

    useEffect(() => {
        setCurrentTask(task)
    }, [task])

    const isPending = currentTask.id.startsWith('optimistic-')

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ 
        id: task.id,
        disabled: isPending,
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div 
            ref={setNodeRef} 
            style={style} 
            {...attributes} 
            {...listeners}
            className={cn(
                'border rounded-md p-2 flex flex-col gap-1.5 min-w-0 cursor-grab active:cursor-grabbing',
                isPending && 'opacity-60',
                isDragging && 'opacity-50 shadow-lg z-50'
            )}
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
                    <div 
                        onClick={(e) => e.stopPropagation()} 
                        onPointerDown={(e) => e.stopPropagation()}
                    >
                        <UpdateTaskForm 
                            task={currentTask}
                            onUpdate={setCurrentTask}
                            disabled={isDragging || isSyncing}
                        />
                    </div>
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

export default SortableTaskItem
