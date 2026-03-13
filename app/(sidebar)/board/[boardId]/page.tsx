import React from 'react'

const BoardPage = () => {
    return (
        <div>BoardPage</div>
    )
}

export default BoardPage

//sample

// 'use client'
// import { useOrg } from '@/context/org-context'
// import { useEffect } from 'react'

// const BoardPage = ({ params }: { params: { boardId: string } }) => {
//     const { setOrgId } = useOrg()
    
//     useEffect(() => {
//         // After fetching board data
//         fetchBoard(params.boardId).then((board) => {
//             setOrgId(board.orgId)
//         })
//     }, [params.boardId, setOrgId])
    
//     return <div>BoardPage</div>
// }