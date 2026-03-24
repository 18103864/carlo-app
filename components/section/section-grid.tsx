import Link from 'next/link'
import { Board, Section, SectionWithTasks, Task } from '@/lib/types'
import { ArrowLeft } from 'lucide-react'
import { Button } from '../ui/button'
import SectionGridClient from './section-grid-client'
import { getTasks } from '@/lib/services/actions/task'

interface SectionGridProps {
    board: Board
    sections: Section[]
}

const SectionGrid = async ({ board, sections }: SectionGridProps) => {
    const sectionsWithTasks: SectionWithTasks[] = await Promise.all(
        sections.map(async (section) => {
            const result = await getTasks(section.id)
            const tasks: Task[] = result.error ? [] : (result.data as Task[])
            return { ...section, tasks }
        })
    )

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