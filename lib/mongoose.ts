/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Mongoose } from 'mongoose';

// let isConnected : boolean = false;
interface MongooseConn {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}
let cached: MongooseConn = (global as any).mongoose;

if(!cached){
    cached = (global as any).mongoose = {
        conn: null,
        promise: null,
    }
}

export const connectToDatabse = async ()=>{
    mongoose.set('strictQuery', true); // set strict query for empty field se bachne k liye
    
    if(!process.env.MONGODB_URL){
        return console.log('missing MONGODB_URL');
    }

    // if(isConnected){
    //     return console.log('Already connected to database');
    // }

    // try {
    //     await mongoose.connect(process.env.MONGODB_URL, {
    //         dbName: "techflow",
    //         bufferCommands:false,
    //         connectTimeoutMS:30000,
    //     })
    //     isConnected = true;
    //     console.log('Connected to database');
    // } catch (error) {
    //     console.error('Failed to connect to database', error);
    // }

    if(cached.conn) return cached.conn;

    cached.promise = cached.promise || 
    mongoose.connect(process.env.MONGODB_URL, {
        dbName: 'techflow',
        bufferCommands: false,
        connectTimeoutMS: 30000
    })
    cached.conn = await cached.promise;
    return cached.conn;
}