import { getUsersQuestion } from '@/lib/actions/user.action'
import React from 'react'
import QuestionCard from '../cards/QuestionCard'
import { SearchParamsProps } from '@/types';

interface Props extends SearchParamsProps {
    userId: string;
    clerkId?: string | null;
}
const QuestionsTab = async ({ userId, clerkId }: Props) => {
    const result = await getUsersQuestion({
        userId,
        page: 1,
    })
  return (
    <>
    {result.questions.map((question) => (
      <QuestionCard 
        key={question._id}
        _id={question._id}
        clerkId={clerkId!}
        title={question.title}
        tags={question.tags}
        author={question.author}
        upvotes={question.upvotes}
        views={question.views}
        answers={question.answers}
        createdAt={question.createdAt}
      />
    ))}
  </>
  )
}

export default QuestionsTab