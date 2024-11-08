/* eslint-disable @typescript-eslint/no-explicit-any */
import Answer from '@/components/forms/Answer'
import AllAnswers from '@/components/shared/AllAnswers'
import Metric from '@/components/shared/Metric'
import ParseHTML from '@/components/shared/ParseHTML'
import RenderTag from '@/components/shared/RenderTag'
import Vote from '@/components/shared/Vote'
import { getQuestionById } from '@/lib/actions/question.action'
import { getUserById } from '@/lib/actions/user.action'
import { formatAndDivideNumber, getTimestamp } from '@/lib/utils'
import { URLProps } from '@/types'
import { auth } from '@clerk/nextjs/server'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import type { Metadata } from 'next'; 
export const metadata : Metadata = {
  title: 'Question Details | TechOverflow.in',
  description: 'A brief explanation to your question along with answers.'
}

const page = async ({params, searchParams} : URLProps) => {
  const {userId:clerkId} = auth();
  let mongoUser;
  if(clerkId) {
    mongoUser = await getUserById({ userId: clerkId })
  }

  const questions = await getQuestionById({questionId: params.id});

  return (
    <>
      <div className=' flex-start w-full flex-col'>
        <div className=' flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center sm:gap-2'>
          <Link  href={`/profile/${questions.author.clerkId}`} className=' flex items-center justify-start gap-1'>
              <Image
              src={questions.author.picture}
              alt="profile"
              width={22}
              height={22}
              className='rounded-full'
              />
              <p className=' paragraph-semibold text-dark300_light700'>
                {questions.author.name}
              </p>
          </Link>
          <div className=' flex justify-end'>
            <Vote
             type="Question"
             itemId={JSON.stringify(questions._id)}
             userId={JSON.stringify(mongoUser._id)}
             upvotes={questions.upvotes.length}
             hasupVoted={questions.upvotes.includes(mongoUser._id)}
             downvotes={questions.downvotes.length}
             hasdownVoted={questions.downvotes.includes(mongoUser._id)}
             hasSaved={mongoUser?.saved.includes(questions._id)}
            />
          </div>
        </div>

        <h2 className=' h2-semibold text-dark200_light900 mt-3.5 w-full text-left'>
          {questions.title}
        </h2>
      </div>

      <div className=' mb-7 mt-4 flex flex-wrap gap-4'>
            <Metric
              imgUrl='/assets/icons/clock.svg'
              alt="clock icon"
              value={` asked ${getTimestamp(questions?.createdAt)}`}
              title="Asked"
              textStyles=" small-medium text-dark400_light800"
            />
            <Metric
              imgUrl='/assets/icons/message.svg'
              alt="answer"
              value={formatAndDivideNumber(questions?.answers?.length)}
              title="Answer"
              textStyles=" small-medium text-dark400_light800"
            />
            <Metric
              imgUrl='/assets/icons/eye.svg'
              alt="views"
              value={formatAndDivideNumber(questions?.views)}
              title="Views"
              textStyles=" small-medium text-dark400_light800"
            />
      </div>

      <ParseHTML data={questions.content}/>

      <div className=' mt-8 flex flex-wrap gap-2'>
        {questions?.tags?.map((tag : any)=>(
          <RenderTag
            key={tag._id}
            _id={tag._id}
            name={tag.name}
            showCount={false}
          />
        ))}
      </div>

      <AllAnswers
        questionId={questions?._id}
        userId={mongoUser._id}
        totalAnswers={questions?.answers?.length}
        page={searchParams?.page}
        filter={searchParams?.filter}
      />

      <Answer
       question={questions?.content}
       questionId={JSON.stringify(questions?._id)}
       authorId={JSON.stringify(mongoUser._id)}
      />
    </>
  )
}

export default page