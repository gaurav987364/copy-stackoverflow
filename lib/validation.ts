import { z } from "zod";

export const QuestionsSchema = z.object({
    title: z.string().min(2).max(120),
    explanation:z.string().min(100),
    tags: z.array(z.string().min(1).max(15)).min(1).max(3), // basicall we need tag in the arrar in form of string and jiski min 1 or max lenght 15 and array ke bhitar 1 tag atleast or max 3 tag
})