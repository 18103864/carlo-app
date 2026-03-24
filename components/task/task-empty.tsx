import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '../ui/empty'
import { Clipboard } from 'lucide-react'

const TaskEmpty = () => {
    return (
        <Empty className='md:p-4'>
            <EmptyHeader>
                <EmptyMedia variant='icon'>
                    <Clipboard />
                </EmptyMedia>
                <EmptyTitle>No Tasks in this Section</EmptyTitle>
                <EmptyDescription>
                    You haven&apos;t created any tasks in this section yet.
                </EmptyDescription>
            </EmptyHeader>
        </Empty>
    )
}

export default TaskEmpty