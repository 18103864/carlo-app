'use client'

import { useTransition } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { updateOrganizationSchema } from '@/lib/schemas/organizations'
import { Controller, useForm } from 'react-hook-form'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Field, FieldError, FieldLabel, FieldDescription } from '@/components/ui/field'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { updateOrganization } from '@/lib/services/actions/organization'
import { Organization } from '@/lib/types'

type FormData = z.infer<typeof updateOrganizationSchema>

interface OrganizationSettingsFormProps {
    organization: Organization
}

const OrganizationSettingsForm = ({ organization }: OrganizationSettingsFormProps) => {
    const [isPending, startTransition] = useTransition()

    const form = useForm<FormData>({
        resolver: zodResolver(updateOrganizationSchema),
        defaultValues: {
            name: organization.name,
        },
    })

    function handleUpdate(data: FormData) {
        startTransition(async () => {
            const result = await updateOrganization(organization.id, data)
            if (result.error) {
                form.setError('name', { message: result.message })
            }
        })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Organization Name</CardTitle>
                <CardDescription>
                    This is the display name of your organization.
                </CardDescription>
            </CardHeader>
            <form onSubmit={form.handleSubmit(handleUpdate)}>
                <CardContent className='mb-4'>
                    <Controller
                        control={form.control}
                        name="name"
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel htmlFor="name">Name</FieldLabel>
                                <Input
                                    {...field}
                                    id={field.name}
                                    placeholder="Enter organization name"
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.error && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isPending} className='w-full'>
                        {isPending ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="size-4 animate-spin" />
                                <span>Saving...</span>
                            </div>
                        ) : 'Save'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}

export default OrganizationSettingsForm
