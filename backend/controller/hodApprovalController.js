import BookRecommendation from "../models/BookRecommendation.js";

export const updateStatus=async(req,res)=>{
    try{
        const{ids,status}=req.body;

        if(!ids || ids.length===0){
            return res.status(400).json({message:"No books IDs provided"});
        }
        if(!["Approved","Rejected","Requested"].includes(status)){
            return res.status(400).json({message:"Invalid status"});
        }

        await BookRecommendation.updateMany(
            {_id:{$in:ids}},
            {$set:{status:status}}
        );

        res.json({message:"Status updated successfully!"});
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Error updating status"});
    }
}

export const getPendingRecommendation=async(req,res)=>{
    try{
        const pending=await BookRecommendation.find({status:"Requested"});

        res.json(pending);
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Error fetching pending recommendations"});
    }
}

export const getProcessedRecommendations=async(req,res)=>{
    try{
        const books=await BookRecommendation.find({
            status:{$in:["Approved","Rejected"]}
        });
        res.json(books);
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Failed to fetch approved/rejected books"});
    }
};