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
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { updateTaskSchema } from '@/lib/schemas/task'
import { Controller, useForm } from 'react-hook-form'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from '../ui/select'
import { updateTask } from '@/lib/services/actions/task'
import { Task } from '@/lib/types'

type FormData = z.infer<typeof updateTaskSchema>

interface UpdateTaskFormProps {
    task: Task
    onUpdate?: (updatedTask: Task) => void
    disabled?: boolean
}

const UpdateTaskForm = ({ task, onUpdate, disabled }: UpdateTaskFormProps) => {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    
    const form = useForm<FormData>({
        resolver: zodResolver(updateTaskSchema),
        defaultValues: {
            title: task.title,
            description: task.description ?? '',
            due_date: task.due_date ? new Date(task.due_date) : undefined,
            assignee_id: task.assignee_id ?? '',
            priority: (task.priority as 'low' | 'medium' | 'high') ?? 'medium',
        },
    })

    function handleUpdateTask(data: FormData) {
        startTransition(async () => {
            const result = await updateTask(task.id, data)
            if (!result.error && result.data) {
                setOpen(false)
                onUpdate?.(result.data as Task)
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="size-6" disabled={disabled}>
                    <Pencil className="size-3" />
                    <span className="sr-only">Edit task</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Update Task</DialogTitle>
                    <DialogDescription>
                        Make changes to your task. Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(handleUpdateTask)} className="grid gap-4">
                    <Controller
                        control={form.control}
                        name="title"
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel htmlFor="title">Task Title</FieldLabel>
                                <Input 
                                    {...field} 
                                    id={field.name} 
                                    placeholder="Enter task title"
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
                                    placeholder="Enter task description (optional)"
                                    aria-invalid={fieldState.invalid} 
                                />
                                {fieldState.error && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                    <div className="grid grid-cols-2 gap-4">
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
                                        <SelectTrigger className="w-full" aria-invalid={fieldState.invalid}>
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
                                        type="date"
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
                                    placeholder="Enter assignee ID"
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

export default UpdateTaskForm
