import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import InvitationActions from "@/components/invitation/invitation-actions"
import { getCurrentUser } from "@/lib/services/getCurrentUser"
import { getInvitationsByUser } from "@/lib/services/queries/invitation"
import { UserInvitation } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { redirect } from "next/navigation"

function getRoleBadgeVariant(role: string) {
    switch (role) {
        case "admin":
            return "secondary" as const
        default:
            return "outline" as const
    }
}

const InvitesPage = async () => {
    const user = await getCurrentUser()

    if (!user) {
        redirect("/auth/login")
    }

    const { data: invitations, error } = await getInvitationsByUser()

    return (
        <div className="min-h-screen-with-header max-w-7xl flex flex-col items-stretch px-6 mx-auto py-6 space-y-6">
            <div className="max-w-4xl mx-auto w-full space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Invitations</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Organizations that have invited you to join.
                    </p>
                </div>

                {error ? (
                    <p className="text-sm text-destructive" role="alert">
                        Could not load invitations. Try again later.
                    </p>
                ) : (
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Invitation ID</TableHead>
                                    {/*TODO: Change To Org Name Later*/}
                                    <TableHead>Role</TableHead>
                                    <TableHead>Invited</TableHead>
                                    <TableHead>Expires</TableHead>
                                    <TableHead className="text-right w-[1%] whitespace-nowrap">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invitations && invitations.length > 0
                                    ? (invitations as UserInvitation[]).map((invitation) => (
                                          <TableRow key={invitation.id}>
                                              <TableCell>
                                                  <p className="text-sm font-medium leading-none">
                                                      {invitation.id}
                                                  </p>
                                              </TableCell>
                                              <TableCell>
                                                  <Badge
                                                      variant={getRoleBadgeVariant(invitation.role)}
                                                      className="capitalize"
                                                  >
                                                      {invitation.role}
                                                  </Badge>
                                              </TableCell>
                                              <TableCell className="text-muted-foreground text-sm">
                                                  {formatDate(invitation.created_at)}
                                              </TableCell>
                                              <TableCell className="text-muted-foreground text-sm">
                                                  {invitation.expires_at
                                                      ? formatDate(invitation.expires_at)
                                                      : "—"}
                                              </TableCell>
                                              <TableCell className="text-right">
                                                  <InvitationActions invitationId={invitation.id} />
                                              </TableCell>
                                          </TableRow>
                                      ))
                                    : (
                                          <TableRow>
                                              <TableCell
                                                  colSpan={5}
                                                  className="h-24 text-center text-muted-foreground"
                                              >
                                                  No pending invitations.
                                              </TableCell>
                                          </TableRow>
                                      )}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default InvitesPage
