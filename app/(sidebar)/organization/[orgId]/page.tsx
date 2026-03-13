import React from 'react'

const organizationPage = async ({
    params
}: {
    params: Promise<{
        orgId: string
    }>
}) => {
    const {orgId} = await params
    console.log(orgId)

    return (
        <div className='max-w-7xl flex flex-col items-stretch px-6 mx-auto space-y-5'>
           a {orgId}
        </div>
    )
}

export default organizationPage