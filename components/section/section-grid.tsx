import { Board, Section } from '@/lib/types'
import { Separator } from '../ui/separator'
import { ArrowLeft } from 'lucide-react'
import { Button } from '../ui/button'
import SectionEmpty from './section-empty'

interface SectionGridProps {
    board: Board
    sections: Section[]
}

const SectionGrid = ({ board, sections }: SectionGridProps) => {
    return (
        <>
        
        <Button variant={'ghost'} size={'xs'} className='ml-4'>
            <ArrowLeft />
            Back to boards
        </Button>
        <div className='w-full flex flex-col px-4 lg:px-10 py-6'>
            <div className='w-full flex justify-between items-center'>
                <h1 className='text-4xl'>
                    {board?.title}
                </h1>
                <div className='flex items-center gap-x-6'>
                    <div className='flex flex-col gap-y-1'>
                        <span className='text-sm text-muted-foreground'>
                            Sections
                        </span>
                        <span className='text-2xl'>
                            {sections.length}
                        </span>
                    </div>
                    <Separator 
                        orientation="vertical"
                        className="data-[orientation=vertical]:h-5"
                    />
                </div>
            </div>
            
            <div className='mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                {sections.length === 0 ? (
                    <div className='col-span-full'>
                        <SectionEmpty />
                    </div>
                ) : (
                    sections.map((section) => (
                        <div 
                            key={section.id}
                            className='p-4 rounded-lg border bg-card shadow-sm'
                        >
                            <h3 className='font-medium'>{section.title}</h3>
                        </div>
                    ))
                )}
            </div>
        </div>
    </>
    )
}

export default SectionGrid