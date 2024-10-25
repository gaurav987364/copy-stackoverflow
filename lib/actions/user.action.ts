/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use server"
import {FilterQuery} from 'mongoose';
import User from "@/database/user.model";
import { connectToDatabse } from "../mongoose"
import { CreateUserParams, DeleteUserParams, GetAllUsersParams, GetSavedQuestionsParams, GetUserByIdParams, GetUserStatsParams, ToggleSaveQuestionParams, UpdateUserParams } from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import Answer from '@/database/answer.model';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getUserById(params: any){
    try {
        connectToDatabse()
        const { userId } =  params;
        // Code to fetch user from database
        const user = await User.findOne({clerkId: userId});
        return user;
    } catch (error) {
        console.log(error); 
    }
}

// create the userCreate function to creat a user in mongo db by getting the details from clerk webhook evt.data 
export async function createUser(userData : CreateUserParams){
    try {
        connectToDatabse()
        const newUser = await User.create(userData);
        return JSON.parse(JSON.stringify(newUser));
    } catch (error) {
        console.log(error); 
    }
}

// update user
export async function updateUser(params : UpdateUserParams){
    try {
        connectToDatabse()

        const {clerkId, updateData, path} = params;
        await User.findOneAndUpdate({clerkId}, updateData, {
            new: true
        });
        revalidatePath(path)
    } catch (error) {
        console.log(error); 
    }
}

// delete user
export async function deleteUser(params : DeleteUserParams){
    try {
        connectToDatabse()

        const {clerkId} = params;
        const user = await User.findOneAndDelete({clerkId});

        if(!user){
            throw new Error('User not found');
        }

        // we have to delete the user data like question, answer, comments etc ...

        // const userQuestionsIds = await Question.find({author:user._id}).distinct('_id');

        // delete user question
        await Question.deleteMany({author:user._id});

        // todo: delete user answer, comments etc

        const deletedUser = await User.findOneAndDelete(user._id);
        return deletedUser;
    } catch (error) {
        console.log(error); 
    }
}

// getting all the users for coummunity page
export async function getAllUsers(params: GetAllUsersParams){
    try {
        connectToDatabse();
        const {searchQuery, filter,page=1, pageSize=1} = params;
        const query : FilterQuery<typeof User> = {};
        if(searchQuery){
            query.$or = [
                {name: {$regex: new RegExp(searchQuery, "i")}},
                {username: {$regex: new RegExp(searchQuery, "i")}},
            ]
        }

        let sortOptions = {};
        switch (filter) {
            case "new_users":
                sortOptions = { joinedAt : -1}
                break;
            
            case "old_users":
                sortOptions = { joinedAt : 1}
                break;
            
            case "top_contributors":
                sortOptions = { reputation : -1}
                break;
            
            default:
                break;
        }

        // pagination logic
        const skipAmount = (page - 1) * pageSize;
        const users = await User.find(query) // phle {} the localsearch k liye change kiya
        // .sort({createdAt: -1}) // old beofre filter
        .skip(skipAmount)
        .limit(pageSize) 
        .sort(sortOptions)

        const totalUsers = await User.countDocuments(query);
        const isNext = totalUsers > skipAmount + users.length;
        return {users, isNext};
    } catch (error) {
        console.log(error); 
    }
}


// we make the add to favourites / add to cllection feature it is on the user server action because user hi to save krega

export async function addToCollection(params: ToggleSaveQuestionParams){
    try {
        connectToDatabse();
        const {userId, questionId, path} = params;
        const user = await User.findById(userId);

        if(!user){
            throw new Error('User not found');
        }

        // we have to check that if item is already saved or not
        const isQuestionSaved = user.saved.includes(questionId);

        if(isQuestionSaved){
            // remove question from saved
            await User.findByIdAndUpdate(userId,
                {$pull : {saved: questionId}},
                {new : true}
            )
        } else {
            // add question to saved
            await User.findByIdAndUpdate(userId,
                {$addToSet : {saved: questionId}},
                {new : true}
            )
        }

        revalidatePath(path);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// get all saved question of the user 
export async function getSavedQuestion(params : GetSavedQuestionsParams){
    try {
        connectToDatabse();
        const {clerkId, page=1, pageSize=10, filter, searchQuery} = params;

        const query: FilterQuery<typeof Question> = searchQuery
        ? { title: { $regex: new RegExp(searchQuery, 'i') } }
        : { };

        let sortOptions = {};
        switch (filter) {
            case "most_recent":
                sortOptions = { createdAt : -1}
                break;
            case "oldest":
                sortOptions = { createdAt : 1 }
                break;
            case "most_voted":
                sortOptions = { upvotes : -1 }
                break;
            case "most_viewed":
                sortOptions = { views : -1 }
                break;
            case "most_answered":
                sortOptions = { answers : -1 }
                break;
        
            default:
                break;
        }
        const user = await User.findOne({clerkId})
        .populate({
            path: 'saved',
            match: query,
            options :{
                // sort : {createdAt : -1},  // this is beofre filter
                sort : sortOptions,
            },
            populate:[
                {path : 'tags', model: Tag, select: " _id name"},
                {path : 'author', model: User, select: " _id name clerkId picture"},
            ]
        })

        if(!user){
            throw new Error('User not found');
        }
        const savedQuestion = user.saved;
        return { Question : savedQuestion}
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// getuser info
export async function getUserInfo(params:GetUserByIdParams) {
    try {
        connectToDatabse()
        const { userId } = params;
        const user = await User.findOne({clerkId : userId});

        if(!user){
            throw new Error('User not found');
        }

        const totalQuestions = await Question.countDocuments({author : user._id});
        const totalAnswers = await Answer.countDocuments({author : user._id});

        return { user, totalQuestions, totalAnswers };
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// get users question information
export async function getUsersQuestion(params: GetUserStatsParams){
    try {
        connectToDatabse();
        const { userId, page=1, pageSize=10} = params;
        // first get total questions information
        const totalQuestions = await Question.countDocuments({author : userId});

        // get fetch questions details based on view and upvotes
        const userQuestions = await Question.find({author : userId}).sort({views: -1, upvotes: -1}).populate('tags', '_id name')
        .populate('author', '_id clerkId name picture')

        return { questions : userQuestions, totalQuestions };

    } catch (error) {
        console.log(error);
        throw error;
    }
}

// get users answer information
export async function getUsersAnswers(params: GetUserStatsParams){
    try {
        connectToDatabse();
        const { userId, page=1, pageSize=10} = params;
        // first get total questions information
        const totalAnswers = await Answer.countDocuments({author : userId});

        // get fetch Answers details based on view and upvotes
        const userAnswers = await Answer.find({author : userId}).sort({ upvotes: -1}).populate('question', '_id title')
        .populate('author', '_id clerkId name picture')

        return { answers : userAnswers, totalAnswers };

    } catch (error) {
        console.log(error);
        throw error;
    }
}