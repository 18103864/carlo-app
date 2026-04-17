'use client'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '../ui/sidebar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { useRouter } from 'nextjs-toploader/app'
import { ChevronsUpDown, Plus } from 'lucide-react'
import { useOrg } from '@/context/org-context'
import OrgLoader from './org-loader'
import { Organization } from '@/lib/types'

interface OrgSwitcherProps {
    organizations: Organization[]
}

const OrgSwitcher = ({ organizations }: OrgSwitcherProps) => {
    const router = useRouter()
    const { orgId, setOrgId } = useOrg()
    const { isMobile } = useSidebar()

    const organization = organizations.find(org => org.id === orgId)

    if (!organization) {
        return (
            <SidebarMenu>
                <SidebarMenuItem>
                    <OrgLoader />
                </SidebarMenuItem>
            </SidebarMenu>
        )
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="group-data-[collapsible=icon]:rounded-full! data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            
                            <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
                                {organization.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{organization.name}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        align="start"
                        side={isMobile ? "bottom" : "right"}
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="text-xs text-muted-foreground">
                            Organizations
                        </DropdownMenuLabel>
                        {organizations?.map((org, index) => (
                            <DropdownMenuItem 
                                key={org.id} className="gap-2 p-2"
                                onClick={() => {
                                    setOrgId(org.id)
                                    router.push(`/organization/${org.id}`)
                                }}
                            >
                                <div className="flex size-6 items-center justify-center rounded-md border">
                                    {org.name.charAt(0).toUpperCase()}
                                </div>
                                {org.name}
                                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 p-2"
                            onClick={() => {
                                router.push('/')
                            }}
                        >
            
                            <div className="font-medium text-muted-foreground">
                                All Organizations
                            </div>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 p-2"
                            onClick={() => {
                                router.push('/create')
                            }}
                        >
                            <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                                <Plus className="size-4" />
                            </div>
                            <div className="font-medium text-muted-foreground">
                                New Organization
                            </div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}

export default OrgSwitcher