'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Field, FieldGroup, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useState } from 'react'
import { setupProfile } from '@/lib/services/actions/profile'
import { useRouter } from 'next/navigation'

const ProfileSetupForm = () => {
    const [name, setName] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const router = useRouter()

    const handleSetup = async (e: React.SubmitEvent) => {
        e.preventDefault()
        if(!name.trim) return

        setIsLoading(true)

        try {
           const result = await setupProfile(name)

           if(result.error){
                console.log(result.message)
           }else{
                console.log(result.message)
           }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
            router.push('/')
        }

        
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Complete Your Profile</CardTitle>
                <CardDescription>
                    Enter your name below to complete your profile
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSetup}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="name">Name</FieldLabel>
                            <Input 
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name..." 
                                required
                            />
                        </Field>
                        <Field>
                            <Button
                                type='submit'
                                disabled={isLoading}
                            >
                                {isLoading ? 'Setting Up Profile' : 'Continue'}
                            </Button>
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    )
}

export default ProfileSetupForm