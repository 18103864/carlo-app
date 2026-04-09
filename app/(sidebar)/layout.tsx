import { ModeToggle } from '@/components/mode-toggle'
import AppSidebar from '@/components/sidebar/app-sidebar'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { getOrganizations } from '@/lib/services/queries/organization'
import { cookies } from 'next/headers'
import React from 'react'

const layout = async ({
    children
}: {
    children: React.ReactNode
}) => {
    const [sidebarCookie, organizationsResult] = await Promise.all([
        cookies(),
        getOrganizations()
    ])
    
    const defaultOpen = sidebarCookie.get('sidebar_state')?.value === 'true'
    const organizations = organizationsResult.data ?? []
    
    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar organizations={organizations} />
            <SidebarInset>
                <header className="flex border-b h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />
                        <ModeToggle className='size-7 -ml-2' />
                    </div>
                </header>
                <main className='flex flex-1 flex-col'>
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default layout