import Link from 'next/link';
import React from 'react'
import RenderTag from '../shared/RenderTag';
import Metric from '../shared/Metric';
import { formatAndDivideNumber, getTimestamp } from '@/lib/utils';
import { SignedIn } from '@clerk/nextjs';
import EditDeleteButton from '../shared/EditDeleteButton';
interface Props {
    _id: string;
    title: string;
    author: {
      [x: string]: string;_id:string, name: string, picture:string
};
    views: number;
    createdAt: Date;
    tags: {_id :string, name:string}[];
    answers: Array<object>;
    upvotes: string[];
    clerkId?: string;
}

const QuestionCard = ({
    _id,
    title,
    author,
    views,
    createdAt,
    tags,
    answers,
    upvotes,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    clerkId
} : Props) => {
  const showActionButton = clerkId && clerkId === author.clerkId;
  return (
    <div className=' card-wrapper rounded-[10px] p-9 sm:px-11'>
        <div className=' flex flex-col-reverse items-start justify-between gap-5 sm:flex-row'>
            <div>
                <span className=' subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden'>
                    {getTimestamp(createdAt)}
                </span>
                <Link href={`/question/${_id}`}>
                  <h3 className=' sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1'>
                    {title}
                  </h3>
                </Link>
            </div>

            <SignedIn>
              {showActionButton && (
                <EditDeleteButton
                 type="Question"
                 itemId={JSON.stringify(_id)}
                />
              )}
            </SignedIn>
        </div>

        <div className=' mt-3.5 flex flex-wrap gap-2'>
            {tags.map(tag => (
                <RenderTag key={tag._id} _id={tag._id} name={tag.name}/>
            ))}
        </div>

        <div className=' flex-between mt-6 w-full flex-wrap gap-3'>
            <Metric
              imgUrl={author?.picture}
              alt="author"
              value={author?.name}
              title={`  --asked ${getTimestamp(createdAt)}`}
              href={`/profile/${author?._id}`}
              isAuthor
              textStyles=" body-medium  text-dark400_light700"
            />
            <div className=' flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start'>
              <Metric
                imgUrl='/assets/icons/like.svg'
                alt="Upvotes"
                value={formatAndDivideNumber(upvotes?.length)}
                title="Votes"
                textStyles=" small-medium text-dark400_light800"
              />
              <Metric
                imgUrl='/assets/icons/message.svg'
                alt="answer"
                value={formatAndDivideNumber(answers?.length)}
                title="Answer"
                textStyles=" small-medium text-dark400_light800"
              />
              <Metric
                imgUrl='/assets/icons/eye.svg'
                alt="views"
                value={formatAndDivideNumber(views)}
                title="Views"
                textStyles=" small-medium text-dark400_light800"
              />
            </div>
        </div>
    </div>
  )
}

export default QuestionCard