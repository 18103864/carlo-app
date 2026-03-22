import React from 'react'
import { SidebarMenuButton } from '../ui/sidebar'
import { ChevronsUpDown } from 'lucide-react'
import { Skeleton } from '../ui/skeleton'

const OrgLoader = () => {
    return (
        <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
        >
            <Skeleton className="size-8 w-8 aspect-square h-8 rounded-lg" />
            <Skeleton className="w-full h-6" />
        </SidebarMenuButton>
    )
}

export default OrgLoader