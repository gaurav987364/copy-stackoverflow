import Question from '@/components/forms/Question';
import { getUserById } from '@/lib/actions/user.action';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';
import type { Metadata } from 'next'; 
export const metadata : Metadata = {
  title: 'Ask a Question | TechOverflow.in',
  description: 'Discover and share knowledge, ask questions, and connect with fellow developers.'
}

const AskQuestion = async () => {
  // getting user id of clerk
  const { userId } = auth();
   console.log(userId);

  // if user is not authenticated, redirect to sign-in page
   // const userId = 'clrk_123abc456def'
  if (!userId) {
    redirect('/sign-in');
    return null;
  }

  const mongoUser = await getUserById({ userId });
  console.log(mongoUser);

  return (
    <div>
      <h1 className='h1-bold text-dark100_light900'>Ask a Question.</h1>
      <div className='mt-9'>
        <Question mongoUserId={JSON.stringify(mongoUser?._id)} />
      </div>
    </div>
  );
};

export default AskQuestion;
