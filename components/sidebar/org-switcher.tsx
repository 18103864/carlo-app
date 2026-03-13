'use client'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '../ui/sidebar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { useRouter } from 'next/navigation'
import { getOrganizationById, getOrganizations } from '@/lib/services/actions/organization'
import { useEffect, useState } from 'react'
import { ChevronsUpDown, Plus } from 'lucide-react'
import Link from 'next/link'
import { useOrg } from '@/context/org-context'

const OrgSwitcher = () => {
    const router = useRouter()
    const { orgId, setOrgId } = useOrg()
    const [organization, setOrganization] = useState<Awaited<ReturnType<typeof getOrganizationById>>['data']>(null)
    const [organizations, setOrganizations] = useState<Awaited<ReturnType<typeof getOrganizations>>['data']>([])
    const [isLoading, setIsLoading] = useState(false)
    const { isMobile } = useSidebar()

    useEffect(() => {
        getOrganizations().then(({ data }) => {
            if (data) {
                setOrganizations(data)
            }
        })
    }, [])

    useEffect(() => {
        if (orgId) {
            setIsLoading(true)
            getOrganizationById(orgId).then(({ data }) => {
                setOrganization(data)
            }).finally(() => {
                setIsLoading(false)
            })
        }
    }, [orgId])

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                {organization?.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{organization?.name}</span>
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