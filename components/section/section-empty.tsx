import { FolderCodeIcon } from 'lucide-react'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '../ui/empty'

const SectionEmpty = () => {
    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <FolderCodeIcon />
                </EmptyMedia>
                <EmptyTitle>No Sections Yet</EmptyTitle>
                <EmptyDescription>
                    You haven&apos;t created any sections yet. Get started by creating
                    your first section.
                </EmptyDescription>
            </EmptyHeader>
        </Empty>
    )
}

export default SectionEmpty