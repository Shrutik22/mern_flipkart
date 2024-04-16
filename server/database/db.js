import mongoose from "mongoose";
//import dotenv from 'dotenv';


export const Connection = async (username, password) => {

    const URL = `mongodb+srv://${username}:${password}@shruti22.8t91r2o.mongodb.net/?retryWrites=true&w=majority`; 
    //const URL = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@shruti22.8t91r2o.mongodb.net/?retryWrites=true&w=majority`; 
    try {
        await mongoose.connect(URL, { useUnifiedTopology: true, useNewUrlParser: true });
        console.log('Database connected Successfully');
    } catch (error) {
        console.log('Error while connecting with the database ', error.message);
    }
}

export default Connection;