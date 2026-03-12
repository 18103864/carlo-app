'use client'
import { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Field, FieldGroup, FieldLabel } from '../ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group'
import { CheckCircle, Mail, XCircle } from 'lucide-react'
import { supabase } from '@/lib/client'
import { Alert, AlertDescription } from '../ui/alert'

const LoginForm = () => {
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
    
    return (
        <Card>
            <CardHeader className='text-center'>
                <CardTitle className="text-xl">
                    Welcome to Carlo
                </CardTitle>
                <CardDescription>
                    Enter email to receive a magic link
                </CardDescription>
                <CardContent>
                    <form onSubmit={handleMagicLink}>
                        <FieldGroup>
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
                    
                </CardContent>
            </CardHeader>
        </Card>
    )
}

export default LoginForm