/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import { CreateQuestionParams, DeleteQuestionParams, EditQuestionParams, GetQuestionByIdParams, GetQuestionsParams, QuestionVoteParams } from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";
import { connectToDatabse } from "../mongoose";
import Answer from "@/database/answer.model";
import Interaction from "@/database/interaction.model";
import { FilterQuery } from "mongoose";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getQuestions(params: GetQuestionsParams) {
  try {
    connectToDatabse()

    // result baed on searchQuery param for local search feature
    const {searchQuery, filter, page=1, pageSize=10} = params;
    // search logic
    const query : FilterQuery<typeof Question> = {};
    if(searchQuery){
      query.$or = [
        {title : {$regex : new RegExp(searchQuery, "i")}},
        {content : {$regex : new RegExp(searchQuery, "i")}}
      ]
    };
    // filter logic
    let sortOptions = {};

    switch (filter) {
      case "newest":
        sortOptions = { createdAt: -1 };
        break;

      case "frequent":
        sortOptions = { views: -1 };
        break;

      case "unanswered":
        query.answers = {$size : 0}
        break;
      default:
        break;
    }
    
    // pagination logic
    // calculate the number of posts to skip based on the page size and number
    const skipAmount = (page - 1) * pageSize;
    const questions = await Question.find(query) // phle ighdr {} tha ab query hai 
      .populate({ path: 'tags', model: Tag })
      .populate({ path: 'author', model: User })
      .skip(skipAmount)
      .limit(pageSize) // phle 20 kya tha ab limit hai
      // .sort({ createdAt: -1 }) // before filters
      .sort(sortOptions)

      // next page existence logic
      const totalQuestions = await Question.countDocuments(query);
      const isNext = totalQuestions > skipAmount + questions.length;

    return { questions, isNext };
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
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
        { upsert: true, new: true }
      )

      tagDocuments.push(existingTag._id);
    }

    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments }}
    });

    // Create an interaction record for the user's ask_question action
    await Interaction.create({
      user: author,
      action: 'ask_question',
      question: question._id,
      tag: tagDocuments
    })
    
    // Increment author's reputation by +5 for creating a question
    await User.findByIdAndUpdate(author, { $inc: { reputation: 5 } })

    revalidatePath(path)
  } catch (error) {
    console.log(error);
  }
}


// get question details
export async function getQuestionById(params:GetQuestionByIdParams) {
  try {
    connectToDatabse()
    const { questionId } = params;

    const questions = await Question.findById(questionId)
    .populate({path:'tags', model: Tag, select:' _id name'})
    .populate({path:'author', model:User, select:'_id clerkId name picture'})

    return questions;
  } catch (error) {
    console.log(error);
    throw error;
  }
}


export async function upvotesQuestion(params:QuestionVoteParams){
  try {
    connectToDatabse()
    const { questionId, userId, hasupVoted, hasdownVoted, path } = params;

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

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {new:true});

    if(!question) {
      throw new Error('Question not found');
    }
    // todo : increment the author reputation kyuki vo platform pe active hai based on upvote/downvote question
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasupVoted? -1 : 1 }
    })

    // increase reputation by +10/-10 for recieve and upvote and downvote for question
    await User.findByIdAndUpdate(question.author, {
      $inc: { reputation: hasupVoted? -10 : 10 }
    })

    revalidatePath(path)
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function downvotesQuestion(params: QuestionVoteParams){
  try {
    connectToDatabse()
    const { questionId, userId, hasupVoted, hasdownVoted, path } = params;
    
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

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {new:true});
    
    if(!question) {
      throw new Error('Question not found');
    }

    // todo : decrement the author reputation kyuki vo platform pe active hai

    await User.findByIdAndUpdate(userId,{
      $inc: { reputation: hasdownVoted ? -2 : 2 }
    })

    // receve vote for question
    await User.findByIdAndUpdate(question.author,{
      $inc: { reputation: hasdownVoted ? -10 : 10 }
    })
    revalidatePath(path)
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// delete question
export async function deleteQuestion(params:DeleteQuestionParams) {
  try {
    connectToDatabse()
    const { questionId, path } = params;
    await Question.deleteOne({_id: questionId});
    await Answer.deleteMany({question: questionId});
    await Interaction.deleteMany({question: questionId});
    await Tag.updateMany({question: questionId},{$pull: {questions: questionId}});

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// edit question
export async function editQuestion(params:EditQuestionParams) {
  try {
    connectToDatabse();
    const { questionId, title, content, path } = params;
    const question =await Question.findById(questionId).populate("tags");

    if(!question){
      throw new Error('Question not found');
    }

    question.title = title;
    question.content = content;

    await question.save();
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getHotQuestions(){
  try {
    connectToDatabse();
    const hotQuestions = await Question.find({})
    .sort({views : -1, upvotes:-1})
    .limit(5)

    return hotQuestions;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// export async function getRecommendedQuestions(params: RecommendedParams) {
//   try {
//     await connectToDatabse();

//     const { userId, page = 1, pageSize = 20, searchQuery } = params;

//     // find user
//     const user = await User.findOne({ clerkId: userId });

//     if (!user) {
//       throw new Error("user not found");
//     }

//     const skipAmount = (page - 1) * pageSize;

//     // Find the user's interactions
//     const userInteractions = await Interaction.find({ user: user._id })
//       .populate("tags")
//       .exec();

//     // Extract tags from user's interactions
//     const userTags = userInteractions.reduce((tags, interaction) => {
//       if (interaction.tags) {
//         tags = tags.concat(interaction.tags);
//       }
//       return tags;
//     }, []);

//     // Get distinct tag IDs from user's interactions
//     const distinctUserTagIds = [
//       ...new Set(userTags.map((tag: any) => tag._id)),
//     ];

//     const query: FilterQuery<typeof Question> = {
//       $and: [
//         { tags: { $in: distinctUserTagIds } }, // Questions with user's tags
//         { author: { $ne: user._id } }, // Exclude user's own questions
//       ],
//     };

//     if (searchQuery) {
//       query.$or = [
//         { title: { $regex: searchQuery, $options: "i" } },
//         { content: { $regex: searchQuery, $options: "i" } },
//       ];
//     }

//     const totalQuestions = await Question.countDocuments(query);

//     const recommendedQuestions = await Question.find(query)
//       .populate({
//         path: "tags",
//         model: Tag,
//       })
//       .populate({
//         path: "author",
//         model: User,
//       })
//       .skip(skipAmount)
//       .limit(pageSize);

//     const isNext = totalQuestions > skipAmount + recommendedQuestions.length;

//     return { questions: recommendedQuestions, isNext };
//   } catch (error) {
//     console.error("Error getting recommended questions:", error);
//     throw error;
//   }
// }