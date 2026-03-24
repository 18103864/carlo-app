import Link from 'next/link'
import { Board, Section } from '@/lib/types'
import { ArrowLeft } from 'lucide-react'
import { Button } from '../ui/button'
import SectionGridClient from './section-grid-client'
import SectionCard from './section-card'


interface SectionGridProps {
    board: Board
    sections: Section[]
}

const SectionGrid = ({ board, sections }: SectionGridProps) => {
    return (
        <div className='h-full flex flex-col'>        
            <Button variant={'ghost'} size={'xs'} className='ml-4 w-fit' asChild>
                <Link href={`/organization/${board.org_id}`}>
                    <ArrowLeft />
                    Back to boards
                </Link>
            </Button>
            <SectionGridClient board={board} initialSections={sections}>
                {sections.map((section) => (
                    <SectionCard key={section.id} section={section} />
                ))}
            </SectionGridClient>
        </div>
    )
}

export default SectionGrid