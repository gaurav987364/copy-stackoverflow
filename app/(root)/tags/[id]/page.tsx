/* eslint-disable @typescript-eslint/no-explicit-any */
import QuestionCard from '@/components/cards/QuestionCard'
import LocalSearchBar from '@/components/shared/navbar/search/LocalSearchBar'
import NoResult from '@/components/shared/NoResult'
import Pagination from '@/components/shared/Pagination'
import { getQuestionByTagId } from '@/lib/actions/tag.action'
import { URLProps } from '@/types'
import React from 'react'
import type { Metadata } from 'next'; 
export const metadata : Metadata = {
  title: 'Tag Details | TechOverflow.in',
  description: 'A tag details page of tech overflow.in.'
}

const Page = async ({params, searchParams} : URLProps) => {
    const result = await getQuestionByTagId({
        tagId: params.id,
        page:searchParams?.page ? +searchParams?.page : 1,
        searchQuery: searchParams.q
    })
    const questions = result.questions || [];
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900"># {result?.tagTitle}</h1>
      <div className=' mt-11 w-full'>
        <LocalSearchBar 
          route={`/tags/${params.id}`} 
          iconPosition='left' 
          imgSrc='/assets/icons/search.svg' 
          placeholder='Search for tag related questions' otherClasses='flex-1'
        />
      </div>

      <div className=' mt-10 flex w-full flex-col gap-6'>
        {questions?.length > 0 ? questions?.map((question : any)=>(
          <QuestionCard 
            key={question._id} 
            _id={question._id}
            title={question.title}
            tags={question.tags}
            author={question.author}
            createdAt={question.createdAt}
            views={question.views}
            upvotes={question.upvotes}
            answers={question.answers}
          />
        )) : <NoResult 
                    title="There is no tag related questions to show"
                    description=" Be the first to break the silence! ☹️🖐️ ask a Question and kickstart the discussion.Our query be the next big thing others learn from.Get involved."
                    link="/ask-question"
                    linkTitle='Ask a Question'
              />}
      </div>

      <div className=' mt-10'>
       <Pagination
        pageNumber={searchParams?.page? +searchParams.page : 1}
        isNext={result?.isNext}
       />
      </div>
    </div>
  )
}

export default Page