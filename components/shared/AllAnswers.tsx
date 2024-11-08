import React from 'react'
import Filters from './Filters';
import { AnswerFilters } from '@/constants/filters';
import { getAnswers } from '@/lib/actions/answer.action';
import Link from 'next/link';
import Image from 'next/image';
import { getTimestamp } from '@/lib/utils';
import ParseHTML from './ParseHTML';
import Vote from './Vote';
import Pagination from './Pagination';
interface Props {
    questionId: string;
    userId: string;
    totalAnswers: number;
    page?: number | string;
    filter?:string;
}
const AllAnswers = async ({questionId,userId,totalAnswers, page, filter}:Props) => {
    const result = await getAnswers({
        questionId,
        page: page ? +page : 1,
        sortBy: filter,
    });
  return (
    <div className=' mt-11'>
        <div className=' flex items-center justify-between'>
            <h3 className=' primary-text-gradient'>{totalAnswers} ~ Answers</h3>
            <Filters
             filters={AnswerFilters}
            />
        </div>

        <div>
            {result?.answers?.map((ans)=>(
                <article key={ans._id} className=' light-border border-b py-10'>
                    <div className=' flex items-center justify-between'>
                        <div className=' mb-8 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2'>
                            <Link href={`/profile/${ans?.author?.clerkId}`} className=' flex flex-1 items-start gap-1 sm:items-center'>
                               <Image 
                               src={ans?.author?.picture}
                               alt="profile"
                               width={18}
                               height={18}
                               className='rounded-full object-cover max-sm:mt-0.5'
                               />
                               <div className=' flex flex-col sm:flex-row sm:items-center'>
                                <p className=' body-semibold text-dark300_light700'>
                                    {ans?.author?.name}
                                </p>

                                <p className=' small-regular text-light400_light500 ml-1 mt-0.5 line-clamp-1'>
                                    <span className=' max-sm:hidden'>
                                    { " " } – 
                                    </span>
                                    answered { " " }
                                    {getTimestamp(ans?.createdAt)}
                                </p>
                               </div>
                            </Link>

                            <div className=' flex justify-end'>
                            <Vote
                                type="Answer"
                                itemId={JSON.stringify(ans._id)}
                                userId={JSON.stringify(userId)}
                                upvotes={ans.upvotes.length}
                                hasupVoted={ans.upvotes.includes(userId)}
                                downvotes={ans.downvotes.length}
                                hasdownVoted={ans.downvotes.includes(userId)}
                            />
                            </div>
                        </div>
                    </div>
                        <ParseHTML data={ans?.content}/>
                </article>
            ))}
        </div>

        <div className="mt-10 w-full">
            <Pagination
             pageNumber={page ? +page : 1}
             isNext={!!result?.isNext}
            />
        </div>
    </div>
  )
}

export default AllAnswers;