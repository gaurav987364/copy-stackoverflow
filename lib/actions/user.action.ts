"use server"

import User from "@/database/user.model";
import { connectToDatabse } from "../mongoose"
import { CreateUserParams, DeleteUserParams, UpdateUserParams } from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";

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