const express = require("express")
const cors = require("cors")
const {connection} = require("./config/db")
const {userRoute} = require("./router/user.route")
const {restaurantRoute} = require("./router/restaurant.route")
const {orderRoute} = require("./router/order.route")
const {authentication} = require("./middleware/authentication")
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

app.get("/",(req, res)=>{
    res.send("WELCOME")
})

app.use("/api", userRoute)
app.use(authentication)
app.use("/api", restaurantRoute)
app.use("/api", orderRoute)

app.listen(process.env.port,async ()=>{
    try {
        await connection;
        console.log("DB CONNECTED");
    } catch (error) {
        console.log("DB NOT CONNECTED", error);
    }
    console.log(`port running at ${process.env.port}`);
})