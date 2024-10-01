"use client"
import React from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
  

interface CustomFilterProps {
    filters: {name: string, value:string}[],
    otherClasses?: string,
    containerClasses?: string,
}
const Filters = ({
    filters,
    otherClasses,
    containerClasses
}:CustomFilterProps) => {
  return (
    <div className={` relative ${containerClasses}`}>
        <Select>
            <SelectTrigger className={`${otherClasses} body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5`}>
                <div className=' line-clamp-1 flex-1 text-left'>
                    <SelectValue placeholder="Select Filter" />
                </div>
            </SelectTrigger>

            <SelectContent>
               <SelectGroup>
               {filters.map((item) => (
                    <SelectItem key={item.value} value={item.value} className="cursor-pointer focus:bg-light-800 dark:focus:bg-dark-400">
                        {item.name}
                    </SelectItem>
                ))}
               </SelectGroup>
            </SelectContent>
        </Select>
    </div>
  )
}

export default Filters;