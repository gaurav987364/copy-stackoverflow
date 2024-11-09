/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useRef, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { QuestionsSchema } from "@/lib/validation";
import { Editor } from "@tinymce/tinymce-react";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { createQuestion, editQuestion } from "@/lib/actions/question.action";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeProvider";

interface Props {
    mongoUserId: string;
    type?: string;
    questionDetails?: string;
}
// we do mode validation file into the validation.ts

// we declare type of buuton
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// const type : any  = 'create';
const Question = ({mongoUserId, type, questionDetails} : Props) => {
  const {mode} = useTheme();
  const editorRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // prevent double submission when button is clicked to prevent error in database
  const router = useRouter();
  const pathname = usePathname();
  const parsedQuestionDetails = questionDetails && JSON.parse(questionDetails || "");
  console.log(parsedQuestionDetails);
  
  // tricky to render tag below form kyuki vo field me nahi show krne
  const allTags = parsedQuestionDetails?.tags?.map((tag : any)=> tag.name)
  // 1. Define your form.
  const form = useForm<z.infer<typeof QuestionsSchema>>({
    resolver: zodResolver(QuestionsSchema),
    defaultValues: {
      title: parsedQuestionDetails?.title || "",
      explanation: parsedQuestionDetails?.content || "",
      tags: allTags || [],
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof QuestionsSchema>) {
    setIsSubmitting(true);
    try {
      if(type === 'edit'){
        await editQuestion({
          title: values.title,
          content: values.explanation,
          questionId: parsedQuestionDetails._id,
          path: pathname
        })
        router.push(`/question/${parsedQuestionDetails._id}`)
      } else {
        await createQuestion({
          title: values.title,
          content: values.explanation,
          tags: values.tags,
          author: JSON.parse(mongoUserId),
          path: pathname
        })
        // make an async call to api => to create a question
        // contain all data
        // navigate to home
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
    console.log(values); 
  }

  // Handle tag removal
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleRemoveTag = (tag: string, field: any) => {
    form.setValue(
      "tags",
      field.value.filter((t: string) => t !== tag)
    );
  };

  // Handle key down event for adding tags
  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    field: any
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const tagInput = e.target as HTMLInputElement;
      const tagValue = tagInput.value.trim();

      if (tagValue !== "") {
        if (tagValue.length > 15) {
          form.setError("tags", {
            type: "manual",
            message: "Tag must be less than 15 characters.",
          });
          return;
        }
        if (!field.value.includes(tagValue)) {
          // Only add unique tags
          form.setValue("tags", [...(field.value || []), tagValue]);
          tagInput.value = ""; // Clear input field
          form.clearErrors("tags"); // Clear errors after successful addition
        }
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-10"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Question Title <span className="text-red-600">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Input
                  className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Be specific and imagine you are asking a question to another
                person.
              </FormDescription>
              <FormMessage className="text-red-600" />
            </FormItem>
          )}
        />

        <FormField
        control={form.control}
        name="explanation"  
        render={({field}) => (
          <FormItem className=' flex w-full flex-col gap-3'>
            <FormLabel className=' paragraph-semibold text-dark400_light800'>Detailed Explanation of you problem. <span className=' text-red-600'>*</span></FormLabel>
            <FormControl className=' mt-3.5'>
            <Editor
            apiKey='p2ewztfqt10bpw8ulz5lynkzikhjav9jw7dm1p1bia6kaf22'
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

                mobile: {
                    toolbar: 'bold italic underline | codesample | undo redo | forecolor | alignright alignleft alignjustify ',
                    menubar: true
                },
                skin: mode === 'dark' ? 'oxide-dark' : 'oxide',
                content_css: mode === 'dark' ? 'dark' : "light",
            }}
            onBlur={field.onBlur}
            onEditorChange={(content)=> field.onChange(content)}
            initialValue={parsedQuestionDetails?.content || ""}
            />
            </FormControl>
            <FormDescription className=' body-regular mt-2.5 text-light-500'>
              Introduce the problem and expand on what you put in the title. Min. 20 Characters.
            </FormDescription>
            <FormMessage className=' text-red-600'/>
          </FormItem>
        )}
      />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Tags <span className="text-red-600">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <>
                  <Input
                    className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                    placeholder="Add tags..."
                    disabled={type === 'edit'}
                    onKeyDown={(e) => handleInputKeyDown(e, field)}
                  />

                  {Array.isArray(field?.value) && field?.value.length > 0 && (
                    <div className="flex-start mt-2.5 gap-2.5">
                      {field?.value.map((tag) => (
                        <Badge
                          key={tag}
                          className="subtle-medium background-light800_dark300 text-light400_light500 flex items-center justify-center gap-2 rounded-md border-none px-4 py-2 capitalize"
                        >
                          #{tag}
                          {type === 'create' && (
                            <Image
                              src="/assets/icons/close.svg"
                              alt="Close icon"
                              width={14}
                              height={14}
                              className="cursor-pointer object-contain invert-0 dark:invert"
                              onClick={() => handleRemoveTag(tag, field)}
                            />
                          )}
                        </Badge>
                      ))}
                    </div>
                  )}
                </>
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Add up to 3 tags to describe what your question is about. Press
                enter ↲ to add tag.
              </FormDescription>
              <FormMessage className="text-red-600" />
            </FormItem>
          )}
        />
        <Button type="submit" className=" primary-gradient w-fit !text-light-900" disabled={isSubmitting}>
           {isSubmitting ? (
            <>
              {type === "edit" ? "Editing..." : "Posting..."}
            </>
           ) : (
            <>
             {type === "edit" ? "Edit Question" : "Ask a Question"}
            </>
           )}
        </Button>
      </form>
    </Form>
  );
};

export default Question;
