import SectionGrid from "@/components/section/section-grid";
import { getBoardById } from "@/lib/services/queries/board";
import { getSections } from "@/lib/services/queries/section";

const BoardPage = async ({
    params
}: {
    params: Promise<{ boardId: string }>
}) => {
    const { boardId } = await params

    const [board, sections] = await Promise.all([
        getBoardById(boardId),
        getSections(boardId)
    ])

    return (
        <div className="min-h-full items-stretch">
            <SectionGrid board={board.data} sections={sections.data ?? []} />
        </div>
    )
}

export default BoardPage
