import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Invitation, Member, UserProfile } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { getMembers } from "@/lib/services/queries/member"
import { getInvitationsByOrg } from "@/lib/services/queries/invitation"
import { getAllProfiles } from "@/lib/services/queries/profile"
import { Button } from "@/components/ui/button"
import { notFound } from "next/navigation"
import { Plus } from "lucide-react"
import InviteMemberDialog from "@/components/organization/invite-member-dialog"

function getRoleBadgeVariant(role: string) {
    switch (role) {
        case "owner":
            return "default" as const
        case "admin":
            return "secondary" as const
        default:
            return "outline" as const
    }
}

function getStatusClassName(status: string) {
    switch (status) {
        case "accepted":
            return "border-green-600/20 text-green-600 dark:border-green-500/20 dark:text-green-500"
        case "removed":
        case "revoked":
        case "expired":
            return "border-red-600/20 text-red-600 dark:border-red-500/20 dark:text-red-500"
        case "pending":
            return "border-yellow-600/20 text-yellow-600 dark:border-yellow-500/20 dark:text-yellow-500"
        case "declined":
            return "border-muted-foreground/20 text-muted-foreground"
        default:
            return ""
    }
}

const MembersPage = async ({
    params,
}: {
    params: Promise<{ orgId: string }>
}) => {
    const { orgId } = await params
    const [{ data: members, error }, { data: invitations, error: invitationsError }, { data: profiles }] = await Promise.all([
        getMembers(orgId),
        getInvitationsByOrg(orgId),
        getAllProfiles(),
    ])

    if (error || !members) {
        notFound()
    }

    const memberIds = new Set((members as Member[]).map((m) => m.member_id))
    const pendingInvitationEmails = new Set(
        (invitations as Invitation[] | undefined)
            ?.filter((i) => i.status === "pending")
            .map((i) => i.email.toLowerCase()) ?? []
    )

    return (
        <div className="max-w-4xl mx-auto w-full min-h-full items-stretch px-4 lg:px-10 py-6 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Members</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Manage and view your organization members.
                    </p>
                </div>
                <InviteMemberDialog
                    organizationId={orgId}
                    profiles={(profiles as UserProfile[] | undefined) ?? []}
                    memberIds={[...memberIds]}
                    pendingInvitationEmails={[...pendingInvitationEmails]}
                >
                    <Button size="sm">
                        <Plus />
                        Invite Member
                    </Button>
                </InviteMemberDialog>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Member</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Joined</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {(members as Member[]).map((member) => (
                            <TableRow key={member.member_id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar size="default">
                                            <AvatarImage
                                                src={member.user_profile.image_url ?? undefined}
                                                alt={member.user_profile.name ?? "Member"}
                                            />
                                            <AvatarFallback>
                                                {member.user_profile.name?.charAt(0).toUpperCase() ?? "?"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <p className="text-sm font-medium leading-none truncate">
                                            {member.user_profile.name ?? "Unnamed"}
                                        </p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={getRoleBadgeVariant(member.role)} className="capitalize">
                                        {member.role}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={`capitalize ${getStatusClassName(member.status)}`}>
                                        {member.status === "accepted" ? "Active" : member.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm">
                                    {formatDate(member.created_at)}
                                </TableCell>
                            </TableRow>
                        ))}
                        {members.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                    No members found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="space-y-4">
                <div>
                    <h2 className="text-lg font-semibold tracking-tight">Pending Invitations</h2>
                    <p className="text-muted-foreground text-sm mt-1">
                        Invitations that have been sent but not yet accepted.
                    </p>
                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Invited</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {!invitationsError && invitations && (invitations as Invitation[]).map((invitation) => (
                                <TableRow key={invitation.id}>
                                    <TableCell>
                                        <p className="text-sm font-medium truncate">{invitation.email}</p>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getRoleBadgeVariant(invitation.role)} className="capitalize">
                                            {invitation.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`capitalize ${getStatusClassName(invitation.status)}`}>
                                            {invitation.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {formatDate(invitation.created_at)}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {(!invitations || invitations.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                        No pending invitations.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}

export default MembersPage
