import { getCurrentUser } from '@/lib/services/getCurrentUser'
import React from 'react'

const SetupPage = async () => {
    const user = await getCurrentUser()
    console.log(`user: ${user}`)
    return (
        <div>SetupPage</div>
    )
}

export default SetupPage