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
import { Textarea } from '@/components/ui/textarea'
import { updateBoardSchema } from '@/lib/schemas/board'
import { Controller, useForm } from 'react-hook-form'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { updateBoard } from '@/lib/services/actions/board'
import { Board } from '@/lib/types'

type FormData = z.infer<typeof updateBoardSchema>

interface UpdateBoardFormProps {
    board: Board
    onUpdate?: (updatedBoard: Board) => void
}

const UpdateBoardForm = ({ board, onUpdate }: UpdateBoardFormProps) => {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    
    const form = useForm<FormData>({
        resolver: zodResolver(updateBoardSchema),
        defaultValues: {
            title: board.title,
            description: board.description ?? '',
        },
    })

    function handleUpdateBoard(data: FormData) {
        startTransition(async () => {
            const result = await updateBoard(board.id, data)
            if (!result.error && result.data) {
                setOpen(false)
                onUpdate?.({
                    ...board,
                    title: result.data.title,
                    description: result.data.description,
                })
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8">
                    <Pencil className="size-4" />
                    <span className="sr-only">Edit board</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update Board</DialogTitle>
                    <DialogDescription>
                        Make changes to your board. Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(handleUpdateBoard)} className="grid gap-4">
                    <Controller
                        control={form.control}
                        name="title"
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel htmlFor="title">Board Title</FieldLabel>
                                <Input 
                                    {...field} 
                                    id={field.name} 
                                    placeholder="Enter board title"
                                    aria-invalid={fieldState.invalid} 
                                />
                                {fieldState.error && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                    <Controller
                        control={form.control}
                        name="description"
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel htmlFor="description">Description (optional)</FieldLabel>
                                <Textarea 
                                    {...field} 
                                    id={field.name} 
                                    placeholder="Enter board description"
                                    rows={3}
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

export default UpdateBoardForm
