/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { ReloadIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import GlobalFilters from './GlobalFilters';
import { globalSearch } from '@/lib/actions/general.action';

const GlobalResult = () => {
    const searchParams = useSearchParams();
    const global = searchParams.get('global');
    const type = searchParams.get('type');

    const [isLoading, setIsLoading] = useState(false);
    const [globalResult, setGlobalResult] = useState([
        {type:'question', id:1, title:"reactjs"},
        {type:'answer', id:4, title:"angular"},
        {type:'question', id:5, title:"vuejs"},
        {type:'answer', id:6, title:"vuejs"},
    ]);


    // href function for navigate
    const renderLink = (type:string, id:string)=>{
        switch (type) {
            case 'question':
                return `/question/${id}`;
            case 'answer':
                return `/question/${id}`;
            case 'user':
                return `/profile/${id}`;
            case 'tag':
                return `/tags/${id}`;
            default:
              return '/'
          }
    }
    useEffect(()=>{
        const fetchResults = async ()=>{
            setGlobalResult([]);
            setIsLoading(true);

            try {
                // we fetch every thing from database 
                const res = await globalSearch({
                    query:global,
                    type
                })
                setGlobalResult(JSON.parse(res))
            } catch (error) {
                console.log(error);
                throw error;
            }  finally {
                setIsLoading(false);
            }
        }

        if(global){
            fetchResults();
        }
    },[global, type])
  return (
    <div className=' absolute top-full z-10 mt-3 w-full rounded-xl bg-light-800 py-5 shadow-sm dark:bg-dark-400'>
        <p className=' text-dark400_light900 paragraph-semibold px-5'>
            <GlobalFilters/> 
        </p>

        <div className=' my-5 h-px bg-light-700/50 dark:bg-dark-500/50'/>

        <div className=' space-y-5'>
            <p className=' text-dark400_light900 paragraph-semibold px-5'>Top Match</p>

            {isLoading ? (
                <div className=' flex-center flex-col px-5'>
                    <ReloadIcon
                     className=' my-2 size-10 animate-spin  text-primary-500'
                    />
                    <p className=' text-dark200_light800 body-regular'>Wait 🕒 Browsing the results.</p>
                </div>
            ) : (
                <div className=' flex flex-col gap-2'>
                    {globalResult.length > 0 ? (
                        globalResult.map((item : any, index:number)=>(
                            <Link 
                                href={renderLink(item.type, item.id)}
                                key={item.type + item.id + index}
                                className=' flex w-full cursor-pointer items-start gap-3 px-5 py-2.5 hover:bg-light-700/50 hover:dark:bg-dark-500/50'
                            >
                                <Image
                                 src="/assets/icons/tag.svg"
                                 alt="tag"
                                 width={18}
                                 height={18}
                                 className=' invert-colors mt-1 object-contain'
                                />

                                <div className=' flex flex-col'>
                                    <p className=' body-medium text-dark200_light800 line-clamp-1'>{item.title}</p>
                                    <p className=' text-light400_light500 small-medium mt-1 font-bold capitalize'>{item.type}</p>
                                </div>
                            </Link>
                        ))
                            
                    ) : (
                        <div className=' flex-center flex-col px-5'>
                            <p className=' text-dark200_light800 body-regular px-5 py-2.5'>
                                Oops🙄!No result found.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    </div>
  )
}

export default GlobalResult