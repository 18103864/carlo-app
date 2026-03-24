import BoardList from "@/components/board/board-list"
import { getBoards } from "@/lib/services/actions/board"
import { getOrganizationById } from "@/lib/services/actions/organization"

const organizationPage = async ({
    params
}: {
    params: Promise<{
        orgId: string
    }>
}) => {
    const {orgId} = await params

    const {data: organization} = await getOrganizationById(orgId)
    const boardsPromise = getBoards(orgId)

    return (
        <div className='min-h-full max-w-full flex flex-col items-stretch'>
            <BoardList organization={organization} boardsPromise={boardsPromise} />
        </div>
    )
}

export default organizationPage