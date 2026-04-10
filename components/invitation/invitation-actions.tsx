'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { acceptInvitation,} from '@/lib/services/actions/invitation'
import { Check, Loader2, X } from 'lucide-react'

interface InvitationActionsProps {
    invitationId: string
}

const InvitationActions = ({ invitationId }: InvitationActionsProps) => {
    const router = useRouter()
    const [isAccepting, startAccepting] = useTransition()
    const [isDeclining, startDeclining] = useTransition()
    const [error, setError] = useState<string | null>(null)

    const busy = isAccepting || isDeclining

    function handleAccept() {
        setError(null)
        startAccepting(async () => {
            const result = await acceptInvitation(invitationId)
            if (result.error) {
                setError(result.message)
                return
            }
            router.refresh()
        })
    }

    return (
        <div className="flex flex-col items-end gap-1">
            <div className="flex justify-end gap-2">
                <Button type="button" size="sm" disabled={busy} onClick={handleAccept}>
                    {isAccepting ? <Loader2 className="size-4 animate-spin" /> : <Check />}
                </Button>
                {/* TODO: Add Decline Button */}
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    )
}

export default InvitationActions
