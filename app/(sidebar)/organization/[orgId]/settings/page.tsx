import OrganizationSettingsForm from "@/components/organization/organization-settings-form"
import { getOrganizationById } from "@/lib/services/queries/organization"
import { notFound } from "next/navigation"

const SettingsPage = async ({
    params,
}: {
    params: Promise<{ orgId: string }>
}) => {
    const { orgId } = await params
    const { data: organization } = await getOrganizationById(orgId)

    if (!organization) {
        notFound();
    }

    return (
        <div className="max-w-4xl w-full mx-auto min-h-full items-stretch px-4 lg:px-10 py-6 space-y-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Manage your organization settings.
                </p>
            </div>
            <OrganizationSettingsForm organization={organization} />
        </div>
    )
}

export default SettingsPage