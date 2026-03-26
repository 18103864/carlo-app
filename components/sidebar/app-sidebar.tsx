import { Organization } from '@/lib/types'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '../ui/sidebar'
import Navigation from './navigation'
import OrgSwitcher from './org-switcher'
import UserButton from './user-button'

interface AppSidebarProps {
    organizations: Organization[]
}

const AppSidebar = ({ organizations }: AppSidebarProps) => {
    return (
        <Sidebar collapsible='icon'>
            <SidebarHeader>
                <OrgSwitcher organizations={organizations} />
            </SidebarHeader>
            <Navigation />
            <SidebarFooter>
                <UserButton />
            </SidebarFooter>
        </Sidebar>
    )
}

export default AppSidebar