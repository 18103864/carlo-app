'use client'
import { useState } from 'react'
import { Button } from '../ui/button'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '../ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group'
import { CheckCircle, GalleryVerticalEnd, Mail, XCircle } from 'lucide-react'
import { supabase } from '@/lib/client'
import { Alert, AlertDescription } from '../ui/alert'
import { cn } from '@/lib/utils'
import { ModeToggle } from '../mode-toggle'

const LoginForm = ({ className, ...props }: React.ComponentProps<"div">) => {
    const [email, setEmail] = useState<string>('')
    const [message, setMessage] = useState<string>('')
    const [isSuccess, setIsSuccess] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const handleMagicLink = async (e: React.SubmitEvent) => {
        e.preventDefault();
        if(!email.trim()) return

        setIsLoading(true)

        try {
            const { error } = await supabase.auth.signInWithOtp({
                email: email.trim(),
                options: {
                    emailRedirectTo: `${window.location.origin}`
                }
            })

            if(error){
                setMessage('Failed to send magic link. Please try again. Error: ' + error.message)
                setIsSuccess(false)
            }else{
                setMessage('Check your email for the magic link!')
                setIsSuccess(true)
            }
        } catch (error) {
            setMessage(`An error occurred: ${error}`)
            setIsSuccess(false)
        } finally {
            setIsLoading(false)
        }
    }

    console.log(message)
    return(
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <form onSubmit={handleMagicLink}>
                <FieldGroup>
                    <div className="flex flex-col items-center gap-2 text-center">
                        <a
                            href="#"
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <div className="flex size-8 items-center justify-center rounded-md">
                                <GalleryVerticalEnd className="size-6" />
                            </div>
                            <span className="sr-only">Carlo</span>
                        </a>
                        <h1 className="text-xl font-bold">Welcome to Carlo</h1>
                        <FieldDescription>
                            Enter email to receive a magic link
                        </FieldDescription>
                    </div>
                    <Field>
                        <FieldLabel>
                            Email
                        </FieldLabel>
                        <InputGroup>
                            <InputGroupAddon>
                                <Mail className='size-4'/>
                            </InputGroupAddon>
                            <InputGroupInput
                                id='email'
                                type='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address" 
                                required    
                            />
                        </InputGroup>
                    </Field>
                    {message && (
                        <Alert
                            className={
                                isSuccess
                                ? "border-green-400 text-green-500"
                                : "border-red-400 text-red-500"
                            }
                        >
                            {isSuccess ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                            
                            <AlertDescription
                                className={isSuccess ? "text-green-500" : "text-red-500"}
                            >
                                {message}
                            </AlertDescription>
                        </Alert>
                    )}
                    <Field>
                        <Button
                            type='submit'
                            disabled={isLoading || isSuccess}
                        >
                            {isLoading ? 'Sending...' : isSuccess ? 'Magic Link Sent' : 'Send Magic Link'}
                        </Button>
                    </Field>
                </FieldGroup>
            </form>
            <FieldDescription className="p-3 text-center text-xs rounded-lg bg-muted/50 border border-border/30">
                    <span className="font-semibold">Secure Authentication:</span>{" "}
                    We'll send you a magic link to sign in
            </FieldDescription>
            <ModeToggle className="absolute top-2 right-2" />
        </div>
    )
}

export default LoginForm