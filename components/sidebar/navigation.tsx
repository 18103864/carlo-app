'use client'
import { CreditCard, Inbox, Presentation, Settings, Users } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useOrg } from '@/context/org-context';

const Navigation = () => {

    const { orgId } = useOrg()

    const Menu = [
        {
            title: 'Boards',
            pathname: `/organization/${orgId}`,
            icon: Presentation
        },
        {
            title: 'Inbox',
            pathname: `/organization/${orgId}/inbox`,
            icon: Inbox
        },
    ];

    const ConfigurationMenu = [
        {
            title: 'Settings',
            pathname: `/organization/${orgId}/settings`,
            icon: Settings
        },
        // {
        //     title: 'Plan & Billing',
        //     pathname: `/organization/${orgId}/billing`,
        //     icon: CreditCard
        // },
        {
            title: 'Members',
            pathname: `/organization/${orgId}/members`,
            icon: Users
        }
    ]

    const pathname = usePathname();

    const isActive = (url: string) => {
        if(url === '/'){
            return pathname === '/';
        }

        return pathname.startsWith(url)
    }

    return (
        <SidebarContent>
            <SidebarGroup>
                <SidebarGroupLabel>
                    Organization
                </SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                        {Menu.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isActive(item.pathname)}
                                    tooltip={item.title}
                                    
                                >
                                    <Link href={item.pathname}>
                                        <item.icon className="size-4"/>
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
                <SidebarGroupLabel>
                    Configuration
                </SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                        {ConfigurationMenu.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton 
                                    asChild 
                                    isActive={isActive(item.pathname)} 
                                    tooltip={item.title}
                                >
                                    <Link href={item.pathname}>
                                        <item.icon className="size-4"/>
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
    )
}

export default Navigation