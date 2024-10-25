"use server"

import Question from "@/database/question.model";
import { connectToDatabse } from "../mongoose";
import { ViewQuestionParams } from "./shared.types";
import Interaction from "@/database/interaction.model";

export async function viewQuestion(params : ViewQuestionParams){
    try {
        await connectToDatabse();
        const { questionId, userId } = params;

        // update view count when user see question first
        await Question.findByIdAndUpdate(questionId, {$inc: {views:1}});

        if(userId){
            // check karege if user has already see the question
            const existingInteraction = await Interaction.findOne({
                user: userId,
                action: 'view',
                question: questionId
            })

            if(existingInteraction) return console.log('viewed');
            
            // creating interaction 
            await Interaction.create({
                user: userId,
                action: 'view',
                question: questionId
            });
        }

    } catch (error) {
        console.log(error);
        throw error;
    }
}