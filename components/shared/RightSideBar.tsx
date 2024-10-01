import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import RenderTag from './RenderTag'

const HotQuestions = [
    {_id:"1", title:'How i do use express as a custom server in nextjs 13?'},
    {_id:"2", title:'How i do use express as a custom server in nextjs 13?'},
    {_id:"3", title:'How i do use express as a custom server in nextjs 13?'},
    {_id:"4", title:'How i do use express as a custom server in nextjs 13?'},
    {_id:"5", title:'How i do use express as a custom server in nextjs 13?'},
]

const PopularTags = [
    {_id:"1", name:"nextjs", totalQuestions:5},
    {_id:"2", name:"javascript", totalQuestions:10},
    {_id:"3", name:"react", totalQuestions:8},
    {_id:"4", name:"nextjs", totalQuestions:6},
    {_id:"5", name:"typescript", totalQuestions:4},
]
const RightSideBar = () => {
  return (
    <section className=' background-light900_dark200 light-border custom-scrollbar sticky right-0 top-0 flex h-screen w-[350px] flex-col overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden'>
        <div>
            <h3 className=' h3-bold text-dark200_light900'>Top Questions</h3>
            <div className=' mt-7 flex w-full flex-col gap-[30px]'>
                {HotQuestions.map(question => (
                   <Link
                    href={`/question/${question._id}`}
                    key={question._id}
                    className='flex cursor-pointer items-center justify-between gap-7'
                   >
                    <p className=' body-medium text-dark500_light700'>{question.title}</p>
                    <Image
                     src='/assets/icons/chevron-right.svg'
                     alt='right arrow'
                     width={20}
                     height={20}
                     className='invert-colors'
                    />
                   </Link>
                ))}
            </div>
        </div>
        <div className=' mt-16'>
          <h3 className=' h3-bold text-dark200_light900'>
            Top Questions
          </h3>
          <div className=' mt-7 flex flex-col gap-4'>
           {PopularTags.map((tag)=>(
            <RenderTag
              key={tag._id}
              _id={tag._id}
              name={tag.name}
              totalQuestions={tag.totalQuestions}
              showCount
            />
           ))}
          </div>
        </div>
    </section>
  )
}

export default RightSideBar