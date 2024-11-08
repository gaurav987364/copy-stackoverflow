import QuestionCard from '@/components/cards/QuestionCard'
import HomeFilters from '@/components/home/HomeFilters'
import Filters from '@/components/shared/Filters'
import LocalSearchBar from '@/components/shared/navbar/search/LocalSearchBar'
import NoResult from '@/components/shared/NoResult'
import Pagination from '@/components/shared/Pagination'
import { Button } from '@/components/ui/button'
import { HomePageFilters } from '@/constants/filters'
import { getQuestions } from '@/lib/actions/question.action'
import { SearchParamsProps } from '@/types'
import Link from 'next/link'
import React from 'react'
// import Loading from './loading'
import type { Metadata } from 'next'; 
export const metadata : Metadata = {
  title: 'Home | TechOverflow',
  description: 'Discover and share knowledge, ask questions, and connect with fellow developers.'
}

const Home = async ({searchParams} : SearchParamsProps) => {
  const questionsData = await getQuestions({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
  }) 
  const questions = questionsData?.questions || []
  
  // const isLoading = true;
  // if(isLoading) return <Loading/>
  return (
    <>
    <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
       <h1 className="h1-bold text-dark100_light900">All Questions</h1> 
       
        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
            Ask a Question
          </Button>
        </Link> 
      </div> 
      <div className=' mt-11 flex justify-between gap-5     max-sm:flex-col sm:items-center'>
        <LocalSearchBar 
          route='/' 
          iconPosition='left' 
          imgSrc='/assets/icons/search.svg' 
          placeholder='Search for question' 
          otherClasses='flex-1'
        />

        <Filters 
          filters={HomePageFilters} 
          otherClasses='min-h-[56px] sm:min-w-[170px]' containerClasses="hidden max-md:flex"
        />
      </div>

      <HomeFilters/>

      <div className=' mt-10 flex w-full flex-col gap-6'>
        {questions?.length > 0 ? questions?.map((question)=>(
          <QuestionCard 
            key={question._id} 
            _id={question._id}
            title={question.title}
            tags={question.tags}
            author={question.author}
            createdAt={question.createdAt}
            views={question.views}
            upvotes={question.upvotes}
            answers={question?.answers}
          />
        )) : <NoResult 
                    title="There is no questions to show"
                    description=" Be the first to break the silence! ☹️🖐️ ask a Question and kickstart the discussion.Our query be the next big thing others learn from.Get involved."
                    link="/ask-question"
                    linkTitle='Ask a Question'
              />}
      </div>

      <div className=' mt-10'>
        <Pagination
            pageNumber={searchParams?.page ? +searchParams.page : 1}
            isNext={questionsData?.isNext}
        />
      </div>
    </>
  )
}

export default Home