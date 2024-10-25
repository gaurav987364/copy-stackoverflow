import { z } from "zod";

export const QuestionsSchema = z.object({
    title: z.string().min(2).max(120),
    explanation:z.string().min(100),
    tags: z.array(z.string().min(1).max(15)).min(1).max(3), // basicall we need tag in the arrar in form of string and jiski min 1 or max lenght 15 and array ke bhitar 1 tag atleast or max 3 tag
})

export const AnswerSchema = z.object({
    answer: z.string().min(100)
})

export const ProfileSchema = z.object({
    name: z.string().min(5).max(50),
    username: z.string().min(5).max(50),
    bio: z.string().min(10).max(150),
    portfolioWebsite: z.string().url(),
    location: z.string().min(5).max(50),
})