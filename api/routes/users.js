const router = require("express").Router()
const bcrypt = require("bcrypt");
const User = require("../models/User");

router.get("/",(req,res)=>{
    res.status(200).json({name: "Micah", username: "Punini"})
})


// update user
router.put("/:id",async(req,res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
        if(req.body.password){
            try {
                const salt = await bcrypt.genSalt(10)
                req.body.Password = await bcrypt.hash(req.body.password, salt);
            } catch (error) {
                return res.status.json(error);
            }
        }
            try {
                const user = await User.findByIdAndUpdate(req.params.id, {
                    $set:req.body
                })
                res.status(200).json("Account has been updated")
            } catch (error) {
                res.status(403).json("you can update only you account")
        }
        
    }else{
        res.status(403).json("you can update only you account")
    }
})
// delete user
router.delete("/:id",async(req,res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
            try {
                const user = await User.findByIdAndDelete(req.params.id)
                res.status(200).json("Account has been updated")
            } catch (error) {
                res.status(403).json("you can update only you account")
            }
    }else{
        res.status(403).json("you can delete only you account")
    }
})
// get a user
router.get("/", async(req,res)=>{
    const userId = req.query.userId;
    const username = req.query.username;
    try {
        const user = userId 
        ? await User.findById(userId) 
        : await User.findOne({username:username});
        const {password,updatedAt, ...other} = user._doc
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json(error)
    }
})
// follow a user
router.put("/:id/follow",async(req,res)=>{
    if(req.body.userId !== req.params.id){
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(!user.followers.includes(req.body.userId)){
                await User.updateOne({$push:{followers:req.body.userId}})
                await currentUser.updateOne({$push:{followings:req.body.userId}})
                res.status(200).json("User has been followed")
            }else{
                res.status(404).json("You already follow this user")
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }else{
        res.status(403).json("Sorry, you can not follow yourself")
    }
})

// unfollow a user
router.put("/:id/unfollow",async(req,res)=>{
    if(req.body.userId !== req.params.id){
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(user.followers.includes(req.body.userId)){
                await User.updateOne({$pull:{followers:req.body.userId}})
                await currentUser.updateOne({$pull:{followings:req.body.userId}})
                res.status(200).json("User has been unfollowed")
            }else{
                res.status(404).json("You already unfollow this user")
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }else{
        res.status(403).json("Sorry, you can not follow yourself")
    }
})


module.exports = router