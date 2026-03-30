'use client'
import { Task } from '@/lib/types'
import { Badge } from '../ui/badge'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import { Pencil } from 'lucide-react'

interface TaskOverlayProps {
    task: Task
}

const TaskOverlay = ({ task }: TaskOverlayProps) => {
    return (
        <div className='border rounded-md p-2 flex flex-col gap-1.5 min-w-0 shadow-xl cursor-grabbing'>
            <div className='flex justify-between items-center'>
                <h2 className='font-semibold text-sm flex items-center gap-1'>
                    {task.title}
                    <Badge 
                        className={cn(
                            'rounded-md text-foreground p-1 h-4 text-[10px]',
                            `${task.priority === 'high' ? 'bg-red-200 text-red-500' : `${task.priority === 'medium' ? 'bg-orange-200 text-orange-500' : 'bg-blue-200 text-blue-500'}`}`
                        )}
                    >
                        {task.priority}
                    </Badge>
                </h2>
                <div className='flex items-center gap-0.5'>
                    <Button variant={'ghost'} size={'icon'} className='size-6' disabled>
                        <Pencil className="size-3" />
                    </Button>
                </div>
            </div>
            <span className='text-xs text-muted-foreground'>
                {task.description}
            </span>
            <div className='min-w-0 flex flex-col gap-1'>
                <span className='block text-xs text-muted-foreground truncate text-ellipsis'>
                    {task.creator_name ?? 'Unknown'} ● {
                        new Date(task.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })
                    }
                </span>
                <span className='block text-xs text-muted-foreground truncate text-ellipsis'>
                    {task.assignee_name ? `Assigned to ${task.assignee_name}` : 'Unassigned'} ● Due {
                        task.due_date 
                            ? new Date(task.due_date).toLocaleDateString("en-US", {
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

export default TaskOverlay
