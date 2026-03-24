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
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { createTaskSchema } from '@/lib/schemas/task'
import { Controller, useForm } from 'react-hook-form'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from '../ui/select'

type FormData = z.infer<typeof createTaskSchema>

interface CreateTaskFormProps {
    sectionId: string
    sortOrder: number
    onSubmit: (data: FormData) => void
    isPending?: boolean
}

const CreateTaskForm = ({ 
    sectionId, 
    sortOrder,
    onSubmit,
    isPending = false
}: CreateTaskFormProps) => {
    const [open, setOpen] = useState(false)
    
    const form = useForm<FormData>({
        resolver: zodResolver(createTaskSchema),
        defaultValues: {
            title: '',
            description: '',
            section_id: sectionId,
            sort_order: sortOrder,
            due_date: undefined,
            assignee_id: '',
            priority: 'medium',
        },
    })

    function handleCreateTask(data: FormData) {
        onSubmit(data)
        setOpen(false)
        form.reset({
            title: '',
            description: '',
            section_id: sectionId,
            sort_order: sortOrder + 1,
            due_date: undefined,
            assignee_id: '',
            priority: 'medium',
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size={'sm'} className='w-full'>
                    <PlusIcon className='size-4' />
                    Add Task
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create Task</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to create a new task. Click create when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(handleCreateTask)} className='grid gap-4'>
                    <Controller
                        control={form.control}
                        name="title"
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel htmlFor="title">Task Title</FieldLabel>
                                <Input 
                                    {...field} 
                                    id={field.name} 
                                    placeholder='Enter task title'
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
                                <FieldLabel htmlFor="description">Description</FieldLabel>
                                <Textarea 
                                    {...field} 
                                    id={field.name}
                                    placeholder='Enter task description (optional)'
                                    aria-invalid={fieldState.invalid} 
                                />
                                {fieldState.error && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                    <div className='grid grid-cols-2 gap-4'>
                        <Controller
                            control={form.control}
                            name="priority"
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel htmlFor="priority">Priority</FieldLabel>
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger className='w-full' aria-invalid={fieldState.invalid}>
                                            <SelectValue placeholder="Select priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">Low</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            control={form.control}
                            name="due_date"
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel htmlFor="due_date">Due Date</FieldLabel>
                                    <Input 
                                        type='date'
                                        id={field.name}
                                        onChange={(e) => {
                                            const date = e.target.value ? new Date(e.target.value) : undefined
                                            field.onChange(date)
                                        }}
                                        value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                                        aria-invalid={fieldState.invalid} 
                                    />
                                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    </div>
                    <Controller
                        control={form.control}
                        name="assignee_id"
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel htmlFor="assignee_id">Assignee ID (optional)</FieldLabel>
                                <Input 
                                    {...field} 
                                    id={field.name}
                                    placeholder='Enter assignee ID'
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
                                    <span>Creating Task...</span>
                                </div>
                            ) : 'Create Task'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateTaskForm
