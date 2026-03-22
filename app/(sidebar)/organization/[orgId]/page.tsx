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
    console.log(orgId)

    const {data: organization, error: organizationError, message: organizationMessage} = await getOrganizationById(orgId)
    const {data: boards, error: boardsError, message: boardsMessage} = await getBoards(orgId)

    return (
        <div className='min-h-full max-w-full flex flex-col items-stretch'>
            <BoardList organization={organization} boards={boards || []} error={boardsError} message={boardsMessage} />
        </div>
    )
}

export default organizationPage