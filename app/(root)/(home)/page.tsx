import QuestionCard from '@/components/cards/QuestionCard'
import HomeFilters from '@/components/home/HomeFilters'
import Filters from '@/components/shared/Filters'
import LocalSearchBar from '@/components/shared/navbar/search/LocalSearchBar'
import NoResult from '@/components/shared/NoResult'
import { Button } from '@/components/ui/button'
import { HomePageFilters } from '@/constants/filters'
import { getQuestions } from '@/lib/actions/question.action'
import Link from 'next/link'
import React from 'react'

// const questions = [
//   {
//     _id:"1",
//     title: 'cascading delete in sql.', 
//     tags:[{_id:"1", name:'python'}, {_id:"2", name: 'sql'}],
//     author: {
//       _id:"1",
//       name: 'john doe',
//       picture: '/images/avatars/avatar1.jpg'
//     },
//     createdAt: new Date('2023-01-01T12:00:00Z'),
//     upvotes: 1000000,
//     views: 10000000,
//     answer: []
//   },

//   {
//     _id:"2",
//     title: 'how to implement a custom validation in a form in react?', 
//     tags:[{_id:"2", name:'react'}, {_id:"3", name: 'javascript'}],
//     author: {
//       _id:"2",
//       name: 'jane doe',
//       picture: '/images/avatars/avatar2.jpg'
//     },
//     createdAt: new Date('2023-01-02T12:00:00Z'),
//     upvotes: 5,
//     views: 50,
//     answer: []
//   },

//   {
//     _id:"3",
//     title: 'how to create a responsive web page using html and css?', 
//     tags:[{_id:"3", name:'html'}, {_id:"4", name: 'css'}],
//     author: {
//       _id:"3",
//       name: 'bill doe',
//       picture: '/images/avatars/avatar3.jpg'
//     },
//     createdAt: new Date('2023-01-03T12:00:00Z'),
//     upvotes: 8,
//     views: 80,
//     answer: []
//   },
// ]
const Home = async () => {
  const questionsData = await getQuestions({}) 
  const questions = questionsData?.questions || []
  console.log(questions);
  
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
        <LocalSearchBar route='/' iconPosition='left' imgSrc='/assets/icons/search.svg' placeholder='Search for question' otherClasses='flex-1'/>

        <Filters filters={HomePageFilters} otherClasses='min-h-[56px] sm:min-w-[170px]' containerClasses="hidden max-md:flex"/>
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
            answers={question.answer}
          />
        )) : <NoResult 
                    title="There is no questions to show"
                    description=" Be the first to break the silence! ☹️🖐️ ask a Question and kickstart the discussion.Our query be the next big thing others learn from.Get involved."
                    link="/ask-question"
                    linkTitle='Ask a Question'
              />}
      </div>
    </>
  )
}

export default Home