"use client"
import { toast } from '@/hooks/use-toast';
import { downvotesAnswer, upvotesAnswer } from '@/lib/actions/answer.action';
import { viewQuestion } from '@/lib/actions/interaction.action';
import { downvotesQuestion, upvotesQuestion } from '@/lib/actions/question.action';
import { addToCollection } from '@/lib/actions/user.action';
import { formatAndDivideNumber } from '@/lib/utils';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
interface Props {
    type: string;
    itemId: string;
    userId: string;
    upvotes: number;
    hasupVoted: boolean;
    downvotes: number;
    hasdownVoted: boolean;
    hasSaved?: boolean;  // Boolean to indicate if the user has saved the item for later
}
const Vote = ({
    type,
    itemId,
    userId,
    upvotes,
    hasupVoted,
    downvotes,
    hasdownVoted,
    hasSaved
} : Props) => {
    const pathname = usePathname();
    const router = useRouter();

    const handleSave = async () => {
      await addToCollection({
        userId: JSON.parse(userId),
        questionId: JSON.parse(itemId),
        path: pathname,
      })

      return toast({
        title: `Question ${!hasSaved ? "Saved in" : "Removed from"} to your collections! `,
        variant: !hasSaved ? 'default' : "destructive"
      })
    }
    
    const handleVote = async (action: string) => {
        if(!userId) {
          return toast({
            title:"Please Log in !",
            description: "You need to log in to perform this action.",
          })
        }
    
        if(action === 'upvote') {
          if(type === 'Question') {
            await upvotesQuestion({ 
              questionId: JSON.parse(itemId),
              userId: JSON.parse(userId),
              hasupVoted,
              hasdownVoted,
              path: pathname,
            })
          } else if(type === 'Answer') {
            await upvotesAnswer({ 
              answerId: JSON.parse(itemId),
              userId: JSON.parse(userId),
              hasupVoted,
              hasdownVoted,
              path: pathname,
            })
          }
    
          // todo: show a toast
          return toast({
            title: `Upvote ${!hasupVoted ? "Successfully" : "Removed"} `,
            variant: !hasupVoted ? 'default' : "destructive"
          })
        }
    
        if(action === 'downvote') {
          if(type === 'Question') {
            await downvotesQuestion({ 
              questionId: JSON.parse(itemId),
              userId: JSON.parse(userId),
              hasupVoted,
              hasdownVoted,
              path: pathname,
            })
          } else if(type === 'Answer') {
            await downvotesAnswer({ 
              answerId: JSON.parse(itemId),
              userId: JSON.parse(userId),
              hasupVoted,
              hasdownVoted,
              path: pathname,
            })
          }
    
          // todo: show a toast
          return toast({
            title: `Downvote ${!hasdownVoted? "Successfully" : "Removed"} `,
            variant:!hasdownVoted? 'default' : "destructive"
          })
          
        }
    }

    // isko call  idhr isliye kiya hai ki hamara vote component question me hai to jab koi is component ya page pr ayga tab hmara ye function run hoga or udhr backend me view +1 hoga
    // mtlb jitni time vote button press hoga utna view count increse hoga
    useEffect(()=>{
      viewQuestion({
        questionId: JSON.parse(itemId),
        userId: userId ? JSON.parse(userId) : undefined,
      })
    },[itemId, userId, router, pathname])

  return (
    <div className=' flex gap-5'>
        <div className=' flex-center gap-2.5'> 
            <div className=' flex-center gap-1.5'>
                <Image 
                    src={hasupVoted
                        ? '/assets/icons/upvoted.svg'
                        : '/assets/icons/upvote.svg'
                    }
                    width={18}
                    height={18}
                    alt="upvote"
                    className="cursor-pointer"
                    onClick={() => handleVote('upvote')}
                />
                <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
                    <p className="subtle-medium text-dark400_light900">
                    {formatAndDivideNumber(upvotes)}
                    </p>
                </div>
            </div>

            <div className="flex-center gap-1.5">
                <Image 
                    src={hasdownVoted
                    ? '/assets/icons/downvoted.svg'
                    : '/assets/icons/downvote.svg'
                    }
                    width={18}
                    height={18}
                    alt="downvote"
                    className="cursor-pointer"
                    onClick={() => handleVote('downvote')}
                />
                <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
                    <p className="subtle-medium text-dark400_light900">
                    {formatAndDivideNumber(downvotes)}
                    </p>
                </div>
            </div>            
        </div>


        {type === 'Question' && (
            <Image 
              src={hasSaved
                ? '/assets/icons/star-filled.svg'
                : '/assets/icons/star-red.svg'
              }
              width={18}
              height={18}
              alt="star"
              className="cursor-pointer"
              onClick={handleSave}
            />
        )}
    </div>
  )
}

export default Vote