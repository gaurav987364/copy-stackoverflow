import { getTopInteractedTags } from '@/lib/actions/tag.action';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { Badge } from '../ui/badge';
import RenderTag from '../shared/RenderTag';
interface Props {
   user: {
    _id: string;
    clerkId: string;
    picture: string;
    name: string;
    username:string; 
   }  
}
const UserCard = async ({user}: Props) => {
    const tags = await getTopInteractedTags({userId: user._id})
  return (
    <>
    <div className=' shadow-light-100 max-xs:min-w-full xs:w-[260px]'>
        <div className=' background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8'>
            <Image
                src={user.picture}
                alt="user Profile Photo"
                width={100}
                height={100}
                className='rounded-full object-cover'
            />

            <Link href={`/profile/${user.clerkId}`}>            
                <div className=' mt-4 cursor-pointer text-center'>
                    <h3 className=' h3-bold text-dark200_light900 line-clamp-1'>{user.name}</h3>
                    <p className=' body-regular text-dark500_light500 mt-2'>@{user.username}</p>
                </div>
            </Link>

            <div className=' mt-4 '>
                {tags && tags.length > 0 ? (
                    <div className=' flex items-center gap-1'>
                        {tags.map((tag)=>(
                            <RenderTag
                             key={tag._id}
                             _id={tag._id}
                             name={tag.name}
                            />
                        ))}
                    </div>
                ) : (
                    <div>
                        <Badge>
                            No tag Interactions Yet!
                        </Badge>
                    </div>
                )}
            </div>
        </div>
    </div>
    </>
  )
}

export default UserCard