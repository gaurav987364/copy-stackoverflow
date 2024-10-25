/* eslint-disable @typescript-eslint/no-explicit-any */
import QuestionCard from '@/components/cards/QuestionCard'
import Filters from '@/components/shared/Filters'
import LocalSearchBar from '@/components/shared/navbar/search/LocalSearchBar'
import NoResult from '@/components/shared/NoResult'
import { QuestionFilters } from '@/constants/filters'
import { getSavedQuestion } from '@/lib/actions/user.action'
import { SearchParamsProps } from '@/types'
import { auth } from '@clerk/nextjs/server'

const Collection = async ({searchParams}: SearchParamsProps) => {
    const {userId} = auth();
    if(!userId) return null;
    const questionsData = await getSavedQuestion({
    clerkId: userId,
    searchQuery: searchParams.q,
    filter:searchParams.filter,
  });
  const questions = questionsData?.Question || []
  
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>
      <div className=' mt-11 flex justify-between gap-5     max-sm:flex-col sm:items-center'>
        <LocalSearchBar 
          route='/' 
          iconPosition='left' 
          imgSrc='/assets/icons/search.svg' 
          placeholder='Search for question' 
          otherClasses='flex-1'
        />

        <Filters 
        filters={QuestionFilters} 
        otherClasses='min-h-[56px] sm:min-w-[170px]'
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
                    title="There is no saved questions to show"
                    description=" Be the first to break the silence! ☹️🖐️ ask a Question and kickstart the discussion.Our query be the next big thing others learn from.Get involved."
                    link="/ask-question"
                    linkTitle='Ask a Question'
              />}
      </div>
    </div>
  )
}

export default Collection