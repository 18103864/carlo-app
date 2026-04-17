'use client'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { createOrganizationSchema } from "@/lib/schemas/organizations"
import { createOrganization } from "@/lib/services/actions/organization"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useRouter } from "nextjs-toploader/app"
import { Controller, useForm } from "react-hook-form"
import z from "zod"


type formData = z.infer<typeof createOrganizationSchema>

const CreatePage = () => {
    const router = useRouter();

    const form = useForm<formData>({
        resolver: zodResolver(createOrganizationSchema),
        defaultValues: {
            name: '',
        },
    })

    async function handleCreateOrganization(data: formData) {
        try {
            const {error, message} = await createOrganization(data)

            if(error){
                console.log(message)
            }

            if(!error){
                router.push('/')
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className='container mx-auto px-4 py-20'>
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader className="">
                    <CardTitle className="text-xl">Create your Organization</CardTitle>
                    <CardDescription>
                        Organizations let you group your projects. Each organization can be set up with distinct team members.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(handleCreateOrganization)}>
                        <FieldGroup>
                            <Controller
                                control={form.control}
                                name="name"
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel htmlFor="name">Name</FieldLabel>
                                        <FieldDescription>
                                            What is the name of your organization? You can change this later.
                                        </FieldDescription>
                                        <Input {...field} id={field.name} aria-invalid={fieldState.invalid} />
                                        {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />

                            <Field
                                orientation="horizontal"
                                className="w-full"
                            >
                                <Button 
                                    type="submit"
                                    className="grow"
                                    disabled={form.formState.isSubmitting}
                                >
                                    {form.formState.isSubmitting ? <div className="flex items-center gap-2">
                                        <Loader2 className="size-4 animate-spin" />
                                        <span>Creating Organization...</span>
                                    </div> : 'Create Organization'}
                                </Button>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default CreatePage