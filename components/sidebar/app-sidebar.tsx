import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '../ui/sidebar'
import Navigation from './navigation'
import OrgSwitcher from './org-switcher'
import UserButton from './user-button'

const AppSidebar = () => {
    return (
        <Sidebar collapsible='icon'>
            <SidebarHeader>
                <OrgSwitcher />
            </SidebarHeader>
            <Navigation />
            <SidebarFooter>
                <UserButton />
            </SidebarFooter>
        </Sidebar>
    )
}

export default AppSidebar