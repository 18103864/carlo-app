import { SidebarMenuButton } from '../ui/sidebar'
import { Skeleton } from '../ui/skeleton'

const UserLoader = () => {
    return (
        <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
        >
            <Skeleton className="size-8 w-8 aspect-square h-8 rounded-lg" />
            <div className="grid flex-1 gap-1 text-left">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
            </div>
        </SidebarMenuButton>
    )
}

export default UserLoader