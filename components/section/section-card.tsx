import { Section, Task } from '@/lib/types'
import SectionCardClient from './section-card-client'
import { getTasks } from '@/lib/services/actions/task'

interface SectionCardProps {
    section: Section
}

const SectionCard = async ({ section }: SectionCardProps) => {
    const result = await getTasks(section.id)
    const tasks: Task[] = result.error ? [] : (result.data as Task[])

    return <SectionCardClient section={section} initialTasks={tasks} />
}

export default SectionCard
