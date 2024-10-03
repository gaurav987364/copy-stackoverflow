/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';

let isConnected : boolean = false;
export const connectToDatabse = async ()=>{
    mongoose.set('strictQuery', true); // set strict query for empty field se bachne k liye
    
    if(!process.env.MONGODB_URL){
        return console.log('missing MONGODB_URL');
    }

    if(isConnected){
        return console.log('Already connected to database');
    }

    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            dbName: "techflow",
        })
        isConnected = true;
        console.log('Connected to database');
    } catch (error) {
        console.error('Failed to connect to database', error);
    }
}