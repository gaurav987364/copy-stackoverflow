/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
"use server"

import User from "@/database/user.model";
import { connectToDatabse } from "../mongoose";
import { GetAllTagsParams, GetQuestionsByTagIdParams, GetTopInteractedTagsParams } from "./shared.types";
import Tag, { ITag } from "@/database/tag.model";
import Question from "@/database/question.model";
import { FilterQuery } from "mongoose";

export async function getTopInteractedTags(params : GetTopInteractedTagsParams){
    try {
        connectToDatabse()
        const { userId } = params;
        const user = await User.findById(userId);
        if(!user){
            throw new Error('User not found');
        }

        // find all tags interaction for the user and group by tag..
        // kis question me tag diya , kis answer me use related , comments me etc stuff

        return [
            {_id:"1", name: "Next js"},
            {_id:"2", name: "React"},
            {_id:"3", name: "Java"}   
        ]
    } catch (error) {
        console.log(error);
        throw error;       
    }
}


// getting all tags details

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getAllTags(params: GetAllTagsParams) {
    try {
      connectToDatabse();
       const {searchQuery, filter, page=1, pageSize=4} = params;
       const query : FilterQuery<typeof Tag> = {};
       if(searchQuery){
            query.$or = [
                {name : {$regex : new RegExp(searchQuery, "i")}}
            ]
       };

       let sortoptions = {};
       switch (filter) {
        case "popular":
            sortoptions = {questions : -1}
            break;
        case "recent":
            sortoptions = { createdAt : -1}
            break;
        case "name":
            sortoptions = { name : 1}
            break;
        case "old":
            sortoptions = { createdAt : 1}
            break;
       
        default:
            break;
       }

       const skipAmout = (page - 1) * pageSize;
      const tags = await Tag.find(query) // phle vahi {} tha
      .sort(sortoptions)
      .skip(skipAmout)
      .limit(pageSize)

      const totalTags = await Tag.countDocuments(query);
      const isNext = totalTags > skipAmout + tags.length;
      return { tags , isNext}
    } catch (error) {
      console.log(error);
      throw error;
    }
}

// getting the details of ags
export async function getQuestionByTagId(params : GetQuestionsByTagIdParams){
    try {
        connectToDatabse();
        const { tagId, page=1, pageSize=1, searchQuery } = params;
        const tagFilter: FilterQuery<ITag> = {_id : tagId}

        const skipAmout = (page - 1) * pageSize;
        const tag = await Tag.findOne(tagFilter)
        .populate({
            path: 'questions',
            model: Question,
            match: searchQuery ? 
            {title :  {$regex : searchQuery, $options : 'i'}} :
            {} ,
            options :{
                sort : {createdAt : -1},
                skip : skipAmout,
                limit : pageSize + 1
            },
            populate:[
                {path : 'tags', model: Tag, select: " _id name"},
                {path : 'author', model: User, select: " _id name clerkId picture"},
            ]
        })

        const isNext = tag?.questions?.length > pageSize;
        if(!tag){
            throw new Error('Tag not found');
        }

        const questions = tag.questions;
        return { tagTitle: tag.name, questions, isNext}
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getTopTags() {
    try {
        connectToDatabse();
        const popularTags = await Tag.aggregate([
            {$project : {name:1, numberOfQuestions: {$size : "$questions"}}},
            {$sort : {numberOfQuestions : -1}},
            {$limit : 5}
        ])

        return popularTags;
    } catch (error) {
        console.log(error);
        throw error;
    }
}