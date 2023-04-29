const express  = require("express")
const {UserModel} = require("../model/user.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require('dotenv').config()

let userRoute = express.Router()

userRoute.get("/", async (req, res)=>{
    try {
        let user = await UserModel.find()
        res.send(user)
    } catch (error) {
        res.send("Something went wrong")
    }
})

// change user passwors => body => {currentPassword:*****, newPassword:*******}
userRoute.patch("/user/:id/reset", async (req, res)=>{
    let id = req.params.id
    let payload = req.body;
    let user_data = await UserModel.findById({_id: id})
    let org_pass = user_data.password
    try {
        bcrypt.compare(payload.currentPassword, org_pass,async (err, result)=>{
            if(result){
                bcrypt.hash(payload.newPassword, 4,async (err, securepass)=>{
                    if(err){
                        res.send("Something went wrong")
                    }else{
                        await UserModel.findByIdAndUpdate({_id: id}, {password:securepass})
                        res.send("Password Updated success")
                    }
                })
            }else{
                res.send("Something went wrong, Check your current password")
            }
        })
    } catch (error) {
        console.log(error);
        res.send("Something went wrong")
    }
})
//$2b$04$kjFpyeuZOslcrdb2RnT22er/QehrroUb.BlWI6DkUXhPOEMt.J6JC

userRoute.post("/register", async (req, res)=>{
    let {name, email, password, address} = req.body
    try {
        bcrypt.hash(password, 4,async (err, securepass)=>{
            if(err){
                res.send("Something went wrong")
            }else{
                let user = new UserModel({name, email, password:securepass, address})
                await user.save()
                res.status(201).send("User register success")
            }
        })
    } catch (error) {
        console.log(error);
        res.send("Something went wrong")
    }
})

//********Sample structure********* */
// {
//     "name": "prags",
//     "email": "p@gmail.com",
//     "password": "p@123",
//     "address": {
    //   "street": "south street",
    //   "city": "chennai",
    //   "state": "Tamilnadu",
    //   "country": "India",
    //   "zip": "621704"
//     }
//   }

userRoute.post("/login", async (req, res)=>{
    let {email, password} = req.body
    try {
        const user = await UserModel.findOne({email})
        const hash_pass = user.password
        if(!user){
            res.send("Please Register First")
        }else{
            bcrypt.compare(password, hash_pass,async (err, result)=>{
                if(result){
                    const token = jwt.sign({userId: user._id}, process.env.key)
                    res.status(201).send({"message":"Login success", "token": token})
                }else{
                    res.send("Something went wrong, check your passowrd ans email")
                }
            })
        }
        
    } catch (error) {
        console.log(error);
        res.send("Something went wrong")
    }
})


module.exports = {userRoute}