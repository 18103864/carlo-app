import Link from 'next/link'
import { Board, Section, SectionWithTasks, Task } from '@/lib/types'
import { ArrowLeft } from 'lucide-react'
import { Button } from '../ui/button'
import SectionGridClient from './section-grid-client'
import { getTasksByBoardId } from '@/lib/services/queries/task'

interface SectionGridProps {
    board: Board
    sections: Section[]
}

const SectionGrid = async ({ board, sections }: SectionGridProps) => {
    const tasksResult = await getTasksByBoardId(board.id)
    const allTasks: Task[] = tasksResult.error ? [] : (tasksResult.data as Task[])
    
    const tasksBySection = allTasks.reduce((acc, task) => {
        if (!acc[task.section_id]) {
            acc[task.section_id] = []
        }
        acc[task.section_id].push(task)
        return acc
    }, {} as Record<string, Task[]>)
    
    const sectionsWithTasks: SectionWithTasks[] = sections.map(section => ({
        ...section,
        tasks: tasksBySection[section.id] || []
    }))

    return (
        <div className='h-full flex flex-col'>        
            <Button variant={'ghost'} size={'xs'} className='ml-4 w-fit' asChild>
                <Link href={`/organization/${board.org_id}`}>
                    <ArrowLeft />
                    Back to boards
                </Link>
            </Button>
            <SectionGridClient board={board} initialSections={sectionsWithTasks} />
        </div>
    )
}

export default SectionGrid