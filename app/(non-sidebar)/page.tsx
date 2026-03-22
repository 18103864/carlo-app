import OrganizationList from "@/components/organization/organization-list";
import { getOrganizations } from "@/lib/services/actions/organization";
import { getCurrentUser } from "@/lib/services/getCurrentUser";
import { redirect } from "next/navigation";

export default async function Home(){
    const user = await getCurrentUser()

    if(!user){
        redirect('/auth/login')
    }

    const {data: organizations, error, message} = await getOrganizations()
    

    return (
        <div className="min-h-screen-with-header max-w-7xl flex flex-col items-stretch px-6 mx-auto space-y-5">
            <OrganizationList organizations={organizations || []} error={error} message={message} id={user.id}/>
        </div>
    )
}