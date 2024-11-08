/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import Question from "@/database/question.model";
import { connectToDatabse } from "../mongoose";
import { SearchParams } from "./shared.types";
import User from "@/database/user.model";
import Answer from "@/database/answer.model";
import Tag from "@/database/tag.model";

const searchableTypes = ["question","user","answer","tag",];
export async function globalSearch(params: SearchParams){
    try {
        connectToDatabse()
        const { query, type } = params;

        const regexQuery = {$regex: query, $options: "i"};

        let results = [];

        const modelAndTypes = [
            {model : Question, searchField : "title", type: "question"},
            {model : User, searchField : "name", type: "user"},
            {model : Answer, searchField : "content", type: "answer"},
            {model : Tag, searchField : "name", type: "tag"},
        ];

        // if user search in capital letters
        const typeLowerCase = type?.toLowerCase();

        if(!typeLowerCase || !searchableTypes.includes(typeLowerCase)){
            // search over everything in databse
            // todo : Tip ::=> dont use async/await in forEach and map etc... instead use for...of loop
            for(const {model, searchField, type} of modelAndTypes){
                const queryResults = await model.find({[searchField] : regexQuery})
                .limit(2)

                results.push(
                    ...queryResults.map((item)=>({
                        title: type === 'answer' ?
                        `Answer containing ${query}` :
                        item[searchField],
                        type,
                        id: type === 'user' ?
                        item.clerkId :
                        type === 'answer' ?
                        item.question :
                        item._id
                    }))
                )
            }
        } else {
            // search in specify model type
            const modelInfo = modelAndTypes.find((item)=> item.type === type);

            if(!modelInfo){
                throw new Error(`Invalid type: ${type}`);
            }

            const queryResults = await modelInfo.model
            .find({[modelInfo.searchField] : regexQuery})
            .limit(8)

            results = queryResults.map((item)=> ({
                title: type === 'answer' ?
                `Answer containing ${query}` :
                item[modelInfo.searchField],
                type,
                id: type === 'user' ?
                item.clerkId :
                type === 'answer' ?
                item.question :
                item._id
            }) )
        }

        return JSON.stringify(results);
    } catch (error) {
        console.log(error);
        throw error;
    }
}