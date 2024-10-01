import Question from '@/components/forms/Question'
import { getUserById } from '@/lib/actions/user.action';
// import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import React from 'react'

const AskQuestion = async () => {
  // getting user idof clerk
  // const {userId} = auth();
  

  const userId = 'clrk_123abc456def'
  // if user is not authenticated, redirect to sign-in page
  if (!userId) redirect('/sign-in')

  const mongoUser = await getUserById({userId})
  console.log(mongoUser);
    
  return (
    <div>
      <h1 className=' h1-bold text-dark100_light900'>Ask a Question.</h1>
      <div className=' mt-9'><Question mongoUserId={JSON.stringify(mongoUser._id)}/></div>
    </div>
  )
}

export default AskQuestion