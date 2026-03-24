'use client'
import { useState, useTransition } from 'react'
import { Loader2, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { 
    Dialog, 
    DialogClose, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger 
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { updateSectionSchema } from '@/lib/schemas/section'
import { Controller, useForm } from 'react-hook-form'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { updateSection } from '@/lib/services/actions/section'
import { Section } from '@/lib/types'

type FormData = z.infer<typeof updateSectionSchema>

interface UpdateSectionFormProps {
    section: Section
    onUpdate?: (updatedSection: Section) => void
}

const UpdateSectionForm = ({ section, onUpdate }: UpdateSectionFormProps) => {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    
    const form = useForm<FormData>({
        resolver: zodResolver(updateSectionSchema),
        defaultValues: {
            title: section.title,
        },
    })

    function handleUpdateSection(data: FormData) {
        startTransition(async () => {
            const result = await updateSection(section.id, data)
            if (!result.error && result.data) {
                setOpen(false)
                onUpdate?.({
                    ...section,
                    title: result.data.title,
                })
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="size-7">
                    <Pencil className="size-3.5" />
                    <span className="sr-only">Edit section</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update Section</DialogTitle>
                    <DialogDescription>
                        Make changes to your section. Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(handleUpdateSection)} className="grid gap-4">
                    <Controller
                        control={form.control}
                        name="title"
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel htmlFor="title">Section Title</FieldLabel>
                                <Input 
                                    {...field} 
                                    id={field.name} 
                                    placeholder="Enter section title"
                                    aria-invalid={fieldState.invalid} 
                                />
                                {fieldState.error && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="size-4 animate-spin" />
                                    <span>Saving...</span>
                                </div>
                            ) : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateSectionForm
