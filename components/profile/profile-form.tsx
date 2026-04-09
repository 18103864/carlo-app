'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { updateProfileSchema } from '@/lib/schemas/profile'
import { Controller, useForm } from 'react-hook-form'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { updateProfile } from '@/lib/services/actions/profile'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/context/auth-context'

type FormData = z.infer<typeof updateProfileSchema>

interface ProfileFormProps {
    profile: {
        id: string
        name: string
        image_url: string
    }
    email: string
}

const ProfileForm = ({ profile, email }: ProfileFormProps) => {
    const [isPending, setIsPending] = useState(false)
    const { profile: authProfile, setProfile } = useAuth()

    const displayName = authProfile?.name ?? profile.name
    const displayImage = authProfile?.image_url ?? profile.image_url

    const form = useForm<FormData>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            name: profile.name,
        },
    })

    async function handleUpdate(data: FormData) {
        setIsPending(true)
        try {
            const result = await updateProfile(data)
            if (result.error) {
                form.setError('name', { message: result.message })
            } else {
                setProfile(prev => prev ? { ...prev, name: data.name } : prev)
                form.reset({ name: data.name })
            }
        } finally {
            setIsPending(false)
        }
    }

    return (
        <div className="space-y-6">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Avatar className="size-16">
                            <AvatarImage src={displayImage} alt={displayName} />
                            <AvatarFallback className="text-lg">
                                {displayName.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle>{displayName}</CardTitle>
                            <CardDescription>{email}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Display Name</CardTitle>
                    <CardDescription>
                        This is the name that will be visible to other members.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={form.handleSubmit(handleUpdate)}>
                    <CardContent className="mb-4">
                        <FieldGroup>
                            <Controller
                                control={form.control}
                                name="name"
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel htmlFor="name">Name</FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            placeholder="Enter your name"
                                            aria-invalid={fieldState.invalid}
                                        />
                                        {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={isPending || !form.formState.isDirty} className="w-full">
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
        </div>
    )
}

export default ProfileForm
