"use server"

import { revalidatePath } from "next/cache";
import { connectToDatabse } from "../mongoose";
import { AnswerVoteParams, CreateAnswerParams, DeleteAnswerParams, GetAnswersParams } from "./shared.types";
import Answer from "@/database/answer.model";
import Question from "@/database/question.model";
import Interaction from "@/database/interaction.model";
import User from "@/database/user.model";

export async function createAnswer(params: CreateAnswerParams){
    // Code to create answer in database
    // Update the question's answerCount
    // Update the user's answerCount
    try {
        connectToDatabse()
        const { content, author, question, path } = params;
        const newAnswer = await Answer.create({
            content,
            author,
            question
        })

        // add the answer to the question asswer array in db
        const questionObj = await Question.findByIdAndUpdate(question,{
            $push: { answers: newAnswer._id },
        })

        // todo add interaction .... to them
        // create a reputation of user answer
        await Interaction.create({
          user: author,
          action: 'answered',
          question,
          answer: newAnswer._id,
          tags: questionObj.tags
        })

        // inc.repu... for every answer 
        await User.findByIdAndUpdate(author,{
          $inc: { reputation: 10 }
        })
        revalidatePath(path)
    } catch (error) {
        console.log(error);
        throw error;
    }
}


// getting the answers
export async function getAnswers(params: GetAnswersParams){
    try {
        connectToDatabse()
        const { questionId, sortBy,page=1, pageSize=1 } = params;
        const skipAmount = (page - 1) * pageSize;
        let sortOptions = {};
        switch (sortBy) {
          case "highestUpvotes":
            sortOptions = { upvotes : -1}
            break;
          case "lowestUpvotes":
            sortOptions = { upvotes : 1}
            break;
          case "old":
            sortOptions = {createdAt : 1}
            break;
          case "recent":
            sortOptions = {createdAt : -1}
            break;
        
          default:
            break;
        }
        const answers = await Answer.find({question: questionId})
        .populate('author', '_id clerkId name picture')
        // .sort({createdAt: -1}) // before filter
        .sort(sortOptions)
        .skip(skipAmount)
        .limit(pageSize)

        const totalAnswer = await Answer.countDocuments({
          question: questionId
        });

        const isNext = totalAnswer > skipAmount + answers.length; 

        return {answers, isNext};
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// voting related two function of upvote and downvote
export async function upvotesAnswer(params:AnswerVoteParams){
    try {
      connectToDatabse()
      const { answerId, userId, hasupVoted, hasdownVoted, path } = params;
  
      let updateQuery = {};
  
      if(hasupVoted){
        updateQuery = { $pull : {upvotes: userId}}
      } else if(hasdownVoted){
        updateQuery = {
          $pull : {downvotes: userId},
          $push : {upvotes: userId}
        }
      } else {
        updateQuery = {
          $addToSet: {upvotes: userId}
        }
      }
  
      const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {new:true});
  
      if(!answer) {
        throw new Error('Answer not found');
      }
      // todo : increment the author reputation kyuki vo platform pe active hai 

      await User.findByIdAndUpdate(userId,{
        $inc: { reputation: hasupVoted ? -2 : 2 }
      })

      // receve vote for answer
      await User.findByIdAndUpdate(answer.author,{
        $inc: { reputation: hasupVoted ? -10 : 10 }
      })
      revalidatePath(path)
    } catch (error) {
      console.log(error);
      throw error;
    }
}


export async function downvotesAnswer(params: AnswerVoteParams){
    try {
      connectToDatabse()
      const { answerId, userId, hasupVoted, hasdownVoted, path } = params;
      
      let updateQuery = {};
      
      if(hasdownVoted){
        updateQuery = { $pull : {downvotes: userId}}
      } else if(hasupVoted){
        updateQuery = {
          $pull : {upvotes: userId},
          $push : {downvotes: userId}
        }
      } else {
        updateQuery = {
          $addToSet: {downvotes: userId}
        }
      }
  
      const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {new:true});
      
      if(!answer) {
        throw new Error('Answer not found');
      }
  
      // todo : decrement the author reputation kyuki vo platform pe active hai
  
      await User.findByIdAndUpdate(userId,{
        $inc: { reputation: hasdownVoted ? -2 : 2 }
      })

      // receve vote for answer
      await User.findByIdAndUpdate(answer.author,{
        $inc: { reputation: hasdownVoted ? -10 : 10 }
      })
      revalidatePath(path)
    } catch (error) {
      console.log(error);
      throw error;
    }
}

export async function deleteAnswer(params:DeleteAnswerParams) {
  try {
    connectToDatabse();
    const { answerId, path } = params;
    const answer = await Answer.findById(answerId);
    if (!answer) {
      throw new Error('Answer not found');
    }
    await Answer.deleteOne({_id: answerId});
    await Question.updateMany({_id: answer.question},{$pull: {answer: answerId}});
    await Interaction.deleteMany({answer: answerId});

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}