const express = require("express")
const {OrderModel} = require("../model/order.model")
const orderRoute = express.Router()

//All orders
orderRoute.get("/orders", async (req, res)=>{
    try {
        let data =await OrderModel.find().populate("user restaurant")
        res.send(data)
    } catch (error) {
        res.send({Error: "Something went wrong"})
    }
})

//specific order identified by its ID
orderRoute.get("/orders/:id", async (req, res)=>{
    let id = req.params.id
    try {
        let data =await OrderModel.findById({_id:id}).populate("user restaurant")
        res.send(data)
    } catch (error) {
        res.send({Error: "Something went wrong"})
    }
})

orderRoute.post("/orders", async (req, res)=>{
    let payload = req.body
    try {
        let data = new OrderModel(payload)
        await data.save();
        res.status(201).send("orders Success")
    } catch (error) {
        res.send({Error: "Something went wrong"})
    }
})

//******SAMPLE STRUCTURE***** */
// {
//     "user" : "644cc1389815e1b0bb9f6046",
//     "restaurant" : "644cce3a48d2d89e0106dcf6",
//   "items": [{
//     "name": "fish fry",
//     "price": 310,
//     "quantity": 2
//   }],
//   "totalPrice": 620,
//   "deliveryAddress": {
//      "street": "south street",
//      "city": "goa",
//      "state": "goa",
//      "country": "India",
//      "zip": "621704"
//   }
// }

orderRoute.patch("/orders/:id", async (req, res)=>{
    let id = req.params.id;
    let payload = req.body;
    try {
        await OrderModel.findByIdAndUpdate({_id: id}, payload)
        res.send("Status has been updated")
    } catch (error) {
        res.send({Error: "Something went wrong"})
    }
})

module.exports = {orderRoute}