import { getUsersAnswers } from '@/lib/actions/user.action';
import { SearchParamsProps } from '@/types';
import React from 'react'
import AnswerCard from '../cards/AnswerCard';
import Pagination from './Pagination';
interface Props extends SearchParamsProps {
    userId: string;
    clerkId?: string | null;
}
const AnswersTab = async ({ userId, clerkId, searchParams }: Props) => {
    const result = await getUsersAnswers({
        userId,
        page: searchParams?.page ? +searchParams.page : 1,
      })
    
      console.log(result.answers)
  return (
    <>
    {result.answers.map((item) => (
      <AnswerCard 
        key={item._id}
        clerkId={clerkId}
        _id={item._id}
        question={item.question}
        author={item.author}
        upvotes={item.upvotes.length}
        createdAt={item.createdAt}
      />  
    ))}

    <div className=' mt-8'>
      <Pagination
       pageNumber={searchParams?.page ? +searchParams.page : 1}
       isNext={!!result.isNext}
      />
    </div>
  </>
  )
}

export default AnswersTab