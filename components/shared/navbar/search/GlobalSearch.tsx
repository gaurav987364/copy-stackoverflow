"use client"
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { Input } from "@/components/ui/input"
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { formUrlQuery, removeKeysFromUrl } from '@/lib/utils';
import GlobalResult from './GlobalResult';

const GlobalSearch = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [search, setSearch] =  useState(query || "");
  const [isOpen, setIsOpen] = useState(false);
  const searchContainerRef = useRef(null)
  // for closing
  useEffect(()=>{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleOutsideClick = (event: any) => {
      if(searchContainerRef.current &&
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
      !searchContainerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setSearch('')
      }
    }

    setIsOpen(false);

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick)
    }
  },[pathname])
  // implemnation of search logic
  useEffect(()=>{
    const ourDebounceFnc = setTimeout(async ()=>{
      if(search){
        const newUrl = await formUrlQuery({
          params: searchParams.toString(),
          key: 'global',
          value: search,
        })
        router.push(newUrl, {scroll : false})
      } else {
        if(query){
          const newUrl = await removeKeysFromUrl({
            params: searchParams.toString(),
            keys: ['global','type']
          })
            router.push(newUrl, { scroll: false });
        }
      }
    }, 300)

    return ()=> clearTimeout(ourDebounceFnc);
  },[search, query, searchParams, router, pathname])
  return (
    <div ref={searchContainerRef} className=' relative w-full max-w-[600px] max-lg:hidden'>
        <div className=' background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4'>
            <Image
              src='/assets/icons/search.svg'
              alt='search'
              width={24}
              height={24}
              className=' cursor-pointer'
            />
            <Input 
              type='text' 
              value={search}
              onChange={
                (e) => {
                  setSearch(e.target.value)
                  if(!isOpen) setIsOpen(true);
              }}
              placeholder='Search for anything...' 
              className=' paragraph-regular no-focus placeholder background-light800_darkgradient text-dark400_light700 border-none shadow-none outline-none'
            />
        </div>
        {isOpen && <GlobalResult/>}
    </div>
  )
}

export default GlobalSearch;