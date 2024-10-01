"use server"

import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import { CreateQuestionParams, GetQuestionsParams } from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";
import { connectToDatabse } from "../mongoose";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getQuestions(params: GetQuestionsParams) {
  try {
    connectToDatabse()

    const questions = await Question.find({})
      .populate({ path: 'tags', model: Tag })
      .populate({ path: 'author', model: User })
      .sort({ createdAt: -1 })

    return { questions };
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export async function createQuestion(params: CreateQuestionParams) {
  try {
    connectToDatabse()

    const { title, content, tags, author, path } = params;

    // Create the question
    const question = await Question.create({
      title,
      content,
      author
    });

    const tagDocuments = [];

    // Create the tags or get them if they already exist
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } }, 
        { $setOnInsert: { name: tag }, $push: { question: question._id } },
        { upsert: true, new: true }
      )

      tagDocuments.push(existingTag._id);
    }

    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments }}
    });

    // Create an interaction record for the user's ask_question action
    
    // Increment author's reputation by +5 for creating a question

    revalidatePath(path)
  } catch (error) {
    console.log(error);
    
  }
}