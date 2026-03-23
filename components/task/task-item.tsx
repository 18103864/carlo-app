import { Task } from '@/lib/types'
import { Badge } from '../ui/badge'
import { cn } from '@/lib/utils'

interface TaskItemProps {
    task: Task
}

const TaskItem = ({ task }: TaskItemProps) => {
    const isPending = task.id.startsWith('optimistic-')

    return (
        <div 
            className={`border rounded-md p-2 flex flex-col gap-1.5 min-w-0 ${
                isPending ? 'opacity-60' : ''
            }`}
        >
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
                    {/* Edit Task */}
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
                        new Date(task.due_date!).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })
                    }
                </span>
            </div>
        </div>
    )
}

export default TaskItem
