'use client'
import { useState } from 'react'
import { Loader2, PlusIcon } from 'lucide-react'
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
import { createSectionSchema } from '@/lib/schemas/section'
import { Controller, useForm } from 'react-hook-form'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'

type FormData = z.infer<typeof createSectionSchema>

interface CreateSectionFormProps {
    boardId: string
    creatorId: string
    sortOrder: number
    onSubmit: (data: FormData) => void
    isPending?: boolean
}

const CreateSectionForm = ({ 
    boardId, 
    creatorId,
    sortOrder,
    onSubmit,
    isPending = false
}: CreateSectionFormProps) => {
    const [open, setOpen] = useState(false)
    
    const form = useForm<FormData>({
        resolver: zodResolver(createSectionSchema),
        defaultValues: {
            title: '',
            board_id: boardId,
            creator_id: creatorId,
            sort_order: sortOrder,
        },
    })

    function handleCreateSection(data: FormData) {
        onSubmit(data)
        setOpen(false)
        form.reset({
            title: '',
            board_id: boardId,
            creator_id: creatorId,
            sort_order: sortOrder + 1,
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size={'sm'}>
                    <PlusIcon className='size-4' />
                    New Section
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Section</DialogTitle>
                    <DialogDescription>
                        Add a new section to organize your tasks. Click create when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(handleCreateSection)} className='grid gap-4'>
                    <Controller
                        control={form.control}
                        name="title"
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel htmlFor="title">Section Title</FieldLabel>
                                <Input 
                                    {...field} 
                                    id={field.name} 
                                    placeholder='Enter section title'
                                    aria-invalid={fieldState.invalid} 
                                />
                                {fieldState.error && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type='button' variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="size-4 animate-spin" />
                                    <span>Creating Section...</span>
                                </div>
                            ) : 'Create Section'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateSectionForm
