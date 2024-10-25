/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useTheme } from '@/context/ThemeProvider';
import { AnswerSchema } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Editor } from '@tinymce/tinymce-react';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { Button } from '../ui/button';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { createAnswer } from '@/lib/actions/answer.action';

interface Props {
    question: string;
    questionId: string;
    authorId: string;
}
const Answer = ({ questionId, authorId }: Props) => {
    const pathname = usePathname();
    const {mode} = useTheme();
    const editorRef = useRef(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const form = useForm<z.infer<typeof AnswerSchema>>({
      resolver: zodResolver(AnswerSchema),
      defaultValues: {
        answer: "",
      },
    });

    const handelCreateAnswer = async (values: z.infer<typeof AnswerSchema>) => {
        setIsSubmitting(true);
    
        try {
          await createAnswer({
            content: values.answer,
            author: JSON.parse(authorId),
            question: JSON.parse(questionId),
            path: pathname,
          });
    
          form.reset();
    
          if(editorRef.current) {
            const editor = editorRef.current as any;
    
            editor.setContent('');
          }
        } catch (error) {
          console.log(error);
        } finally {
          setIsSubmitting(false)
        }
      }
  return (
    <div>
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
            <h4 className="paragraph-semibold text-dark400_light800">
               Write your answer here
            </h4>

            <Button
            className="btn light-border-2 gap-1.5 rounded-md px-4 py-2.5 text-primary-500 shadow-none dark:text-primary-500"
            onClick={() => {}}
            >
                <Image
                    src="/assets/icons/stars.svg"
                    alt="star"
                    width={12}
                    height={12}
                    className="object-contain"
                />
                Generate an AI Answer
            </Button>
        </div>

        <Form {...form}>
            <form className=' mt-5 flex w-full flex-col gap-10' onSubmit={form.handleSubmit(handelCreateAnswer)}>
            <FormField
            control={form.control}  
            name='answer'
            render={({field}) => (
            <FormItem className=' flex w-full flex-col gap-3'>
                <FormControl className=' mt-3.5'>
                    <Editor
                    apiKey='rci8b0c4khlnkdj8iiffct6e7wz7w78811aqrz86fvm6s0l7'
                    onInit={(evt, editor) => {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        editorRef.current = editor
                    }}
                    init={{
                        height: 370,
                        menubar: false,
                        plugins: [
                        // Core editing features
                        'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
                        // Your account includes a free trial of TinyMCE premium features
                        // Try the most popular premium features until Oct 10, 2024:
                        'checklist', 'mediaembed', 'casechange', 'export', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'editimage', 'advtemplate', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown',
                        ],
                        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline codesample strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',

                        skin: mode === 'dark' ? 'oxide-dark' : 'oxide',
                        content_css: mode === 'dark' ? 'dark' : "light",
                        mobile: {
                            toolbar: 'bold italic underline | codesample | undo redo | forecolor | alignright alignleft alignjustify ',
                            menubar: true
                        },
                    }}
                    onBlur={field.onBlur}
                    onEditorChange={(content)=> field.onChange(content)}
                    initialValue=""
                    />
                </FormControl>
                <FormMessage className=' text-red-600'/>
            </FormItem>
            )}
        />

        <div className=' flex justify-end'>
                <Button
                type="submit"
                className="primary-gradient w-fit text-white"
                disabled={isSubmitting}
                >
                {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
        </div>
            </form>
        </Form>
    </div>
  )
}

export default Answer