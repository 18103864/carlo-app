'use client'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Card, CardContent, CardTitle } from '../ui/card'
import { Boxes, Crown } from 'lucide-react'
import OrganizationHeader from './organization-header'
import { Organization } from '@/lib/types'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '../ui/empty'

const OrganizationList = ({
    organizations,
    error,
    message,
    id
}: {
    organizations: Organization[]
    error: boolean
    message?: string 
    id: string
}) => {

    if(error){
        return (
            <>
                <OrganizationHeader />
            
                <div className='flex flex-1 items-center justify-center'>
                    <div>
                        <h2>Error Loading Organizations</h2>
                        <p>{message}</p>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <OrganizationHeader />

            {organizations.length === 0 ? (
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <Boxes strokeWidth={1}/>
                        </EmptyMedia>
                        <EmptyTitle>No Organizations Yet</EmptyTitle>
                        <EmptyDescription>
                            You haven&apos;t created any organizations yet. Get started by creating
                            your first organization.
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            ) : (
                <div className={cn(
                    'gap-4 grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))]',
                )}>
                    {organizations.map((organization: any) => (
                        <Link href={`/organization/${organization.id}`} key={organization.id}>
                            <Card className="@container/card rounded-md py-4 hover:border-primary">
                                <CardContent className='flex items-center gap-2 px-4 w-full'>
                                <div className="rounded-full bg-primary text-primary-foreground w-10 aspect-square flex items-center justify-center">
                                    <Boxes strokeWidth={1.25} size={20}/>
                                </div>
                                <div className='w-full'>
                                    <CardTitle className="w-full text-sm font-semibold tabular-nums flex items-center justify-between gap-1">
                                        <span>
                                            {organization.name}
                                        </span>
                                        {id === organization.owner_id && (
                                            <Crown size={16} className='text-yellow-500'/>
                                        )}
                                    </CardTitle>
                                </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </>
    )
}

export default OrganizationList