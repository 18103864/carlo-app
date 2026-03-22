'use client'
import { useState } from 'react'
import { Board, Organization } from '@/lib/types'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group'
import { Loader2, PlusIcon, Search } from 'lucide-react'
import { Button } from '../ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Textarea } from '../ui/textarea'
import { Input } from '../ui/input'
import { createBoardSchema } from '@/lib/schemas/board'
import { Controller, useForm } from 'react-hook-form'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Field, FieldError, FieldLabel } from '../ui/field'
import { createBoard } from '@/lib/services/actions/board'

type formData = z.infer<typeof createBoardSchema>

const BoardHeader = ({ 
    organization,
    onBoardCreated,
}: { 
    organization: Organization
    onBoardCreated: (board: Board) => void
}) => {
    const [open, setOpen] = useState(false)
    const form = useForm<formData>({
        resolver: zodResolver(createBoardSchema),
        defaultValues: {
            title: '',
            description: '',
            org_id: organization.id,
        },
    })
    
    async function handleCreateBoard(data: formData) {
        const {error, message, board} = await createBoard(data)

        if(error){
            console.log(message)
            return
        }

        if(board) {
            onBoardCreated(board)
            setOpen(false)
            form.reset()
        }
    }
    return (
        <>
            <div className='w-full px-4 lg:px-10 py-6 mx-auto'>
                <h1 className='text-4xl'>
                    {organization.name ? `${organization.name} Boards` : 'Your Boards'}
                </h1>
            </div>
            <div className='w-full px-4 lg:px-10 flex justify-between items-center gap-2'>
                <InputGroup className='w-60 h-8'>
                    <InputGroupAddon>
                        <Search />
                    </InputGroupAddon>
                    <InputGroupInput 
                        placeholder='Search Boards'
                    />
                </InputGroup>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button size={'sm'}>
                            <PlusIcon />
                            New Board
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Create Board</DialogTitle>
                            <DialogDescription>
                                Fill the details below to create a board. Click create board when you&apos;re
                                done.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={form.handleSubmit(handleCreateBoard)} className='grid gap-4'>
                            <Controller
                                control={form.control}
                                name="title"
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel htmlFor="title">Board Title</FieldLabel>
                                        <Input {...field} id={field.name} aria-invalid={fieldState.invalid} />
                                        {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                control={form.control}
                                name="description"
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel htmlFor="description">Description</FieldLabel>
                                        <Textarea {...field} id={field.name} aria-invalid={fieldState.invalid} />
                                        {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type='button' variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit" disabled={form.formState.isSubmitting}>
                                    {form.formState.isSubmitting ? <div className="flex items-center gap-2">
                                        <Loader2 className="size-4 animate-spin" />
                                        <span>Creating Board...</span>
                                    </div> : 'Create Board'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
                
            </div>
        </>
    )
        
}

export default BoardHeader