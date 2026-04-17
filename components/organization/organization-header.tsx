'use client'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group'
import { PlusIcon, Search } from 'lucide-react'
import { Button } from '../ui/button'
import { useRouter } from 'nextjs-toploader/app'

const OrganizationHeader = () => {
    const router = useRouter()
    return (
        <>
            <div className='w-full pt-12 mx-auto'>
                <h1 className='text-4xl'>
                    Your Organizations
                </h1>
            </div>
            <div className='w-full mx-auto flex justify-between items-center gap-2'>
                <InputGroup className='w-60 h-8'>
                    <InputGroupAddon>
                        <Search />
                    </InputGroupAddon>
                    <InputGroupInput 
                        placeholder='Search organizations'
                    />
                </InputGroup>
                <Button size={'sm'} onClick={() => router.push('/create')}>
                    <PlusIcon />
                    New Organization
                </Button>
            </div>
        </>
    )
}

export default OrganizationHeader