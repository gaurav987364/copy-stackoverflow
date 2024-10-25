import UserCard from '@/components/cards/UserCard'
import Filters from '@/components/shared/Filters'
import LocalSearchBar from '@/components/shared/navbar/search/LocalSearchBar'
import Pagination from '@/components/shared/Pagination'
import { UserFilters } from '@/constants/filters'
import { getAllUsers } from '@/lib/actions/user.action'
import { SearchParamsProps } from '@/types'
import Link from 'next/link'
import React from 'react'

const page = async ({searchParams}: SearchParamsProps) => {
    // Fetching user data from API
     const users = await getAllUsers({
      searchQuery: searchParams.q,
      filter: searchParams.filter,
      page: searchParams?.page ? +searchParams.page : 1
     });
  return (
    <>
    <h1 className="h1-bold text-dark100_light900">All Users</h1> 
      <div className=' mt-11 flex justify-between gap-5     max-sm:flex-col sm:items-center'>
        <LocalSearchBar 
            route='/community' 
            iconPosition='left' 
            imgSrc='/assets/icons/search.svg' 
            placeholder='Search for users' 
            otherClasses='flex-1'
        />

        <Filters 
            filters={UserFilters} 
            otherClasses='min-h-[56px] sm:min-w-[170px]'
        />
      </div>

      <section className=' mt-12 flex flex-wrap gap-4'>
        {users &&  users?.users?.length > 0 ? (
            users?.users?.map((user)=>(
                <UserCard key={user._id} user={user}/>
            ))
        ) : (
            <div className='paragraph-regular text-dark200_light800 mx-auto max-w-4xl text-center'>
                <p>🙄Oops! No users found</p>
                <Link href='/sign-up' className=' mt-2 font-bold text-accent-blue'>
                 Join the Community.
                </Link>
            </div>
        )}
      </section>

      <div className=' mt-10'>
       <Pagination
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={!!users?.isNext}
       />
      </div>
    </>
  )
}

export default page