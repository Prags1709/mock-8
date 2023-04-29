const mongoose = require("mongoose")
const {UserModel} = require("./user.model")
const {RestaurantModel} = require("./restarunt.model")
const orderSchema = mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: UserModel},
    restaurant: {type: mongoose.Schema.Types.ObjectId, ref: RestaurantModel},
    items: [{
        name: {type: String, require:true},
        price: {type: Number, require:true},
        quantity: {type: Number, require:true},
    }],
    totalPrice: {type: Number, require:true},
    deliveryAddress: {
        street: {type: String, require:true},
        city: {type: String, require:true},
        state: {type: String, require:true},
        country: {type: String, require:true},
        zip: {type: String, require:true}
    },
    status: {type: String, enum: ["placed", "preparing", "on the way", "delivered"], default: 'preparing'}
})

const OrderModel = mongoose.model("order", orderSchema)

module.exports = {OrderModel}