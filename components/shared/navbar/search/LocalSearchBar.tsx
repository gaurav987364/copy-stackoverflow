"use client"
import { Input } from '@/components/ui/input';
import { formUrlQuery, removeKeysFromUrl } from '@/lib/utils';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

interface CustomInputProps {
    route: string;
    iconPosition: string;
    imgSrc: string;
    placeholder: string;
    otherClasses?: string;
}
const LocalSearchBar = ({
    route,
    iconPosition,
    imgSrc,
    placeholder,
    otherClasses
} : CustomInputProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get('q');

  const [search, setSearch] =  useState(query || "");

  // implemnation of search logic
  useEffect(()=>{
    const ourDebounceFnc = setTimeout(async ()=>{
      if(search){
        const newUrl = await formUrlQuery({
          params: searchParams.toString(),
          key: 'q',
          value: search,
        })
        router.push(newUrl, {scroll : false})
      } else {
        if(pathname === route){
          const newUrl = await removeKeysFromUrl({
            params: searchParams.toString(),
            keys: ['q']
          })
            router.push(newUrl, { scroll: false });
        }
      }
    }, 300)

    return ()=> clearTimeout(ourDebounceFnc);
  },[search, query, searchParams, router, route,pathname])
  return (
    <div className={` background-light800_darkgradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4 ${otherClasses}`}>
       {iconPosition === 'left' && (
         <Image 
         src={imgSrc}
         alt='search'
         width={24}
         height={24}
         className=' cursor-pointer'
       />)}

       <Input 
        type='text'
        placeholder={placeholder}
        value={search}
        onChange={(e)=> setSearch(e.target.value)}
        className=' paragraph-regular no-focus placeholder text-dark400_light700 border-none bg-transparent shadow-none outline-none'
       />
    </div>
  )
}

export default LocalSearchBar