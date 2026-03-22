import { Skeleton } from '../ui/skeleton'

const BoardsListLoader = () => {
    return (
        <div className='gap-4 p-4 lg:px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            <Skeleton className='w-full h-24'/>
            <Skeleton className='w-full h-24'/>
            <Skeleton className='w-full h-24'/>
            <Skeleton className='w-full h-24'/>
        </div>
    )
}

export default BoardsListLoader