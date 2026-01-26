import mongoose from "mongoose";


const connectMongo=()=>{
    mongoose
    .connect("mongodb://localhost:27017/book_recommendations")
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));
}
export default connectMongo;