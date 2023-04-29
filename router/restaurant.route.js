const express = require("express")
const {RestaurantModel} = require("../model/restarunt.model")
const restaurantRoute = express.Router()

restaurantRoute.get("/restaurants", async (req, res)=>{
    try {
        let data =await RestaurantModel.find()
        res.send(data)
    } catch (error) {
        res.send({Error: "Something went wrong"})
    }
})

//specific restaurant identified by its ID
restaurantRoute.get("/restaurants/:id", async (req, res)=>{
    let id = req.params.id
    try {
        let data =await RestaurantModel.findById({_id:id})
        res.send(data)
    } catch (error) {
        res.send({Error: "Something went wrong"})
    }
})

//Menu of specific restaurant identified by its ID
restaurantRoute.get("/restaurants/:id/menu", async (req, res)=>{
    let id = req.params.id
    try {
        let data =await RestaurantModel.findById({_id:id})
        res.send(data.menu)
    } catch (error) {
        res.send({Error: "Something went wrong"})
    }
})

restaurantRoute.post("/restaurants", async (req, res)=>{
    let payload = req.body
    try {
        let data = new RestaurantModel(payload)
        await data.save();
        res.status(201).send("restaurants data has been inserted")
    } catch (error) {
        res.send({Error: "Something went wrong"})
    }
})

//******SAMPLE STRUCTURE***** */
// {
//   "name": "Alharaf",
//   "address": {
//     "street": "main bybas",
//     "city": "pallikadu",
//     "state": "Kerala",
//     "country": "India",
//     "zip": "638733"
//   },
//   "menu": [{
//     "name": "Fish fry",
//     "description": "high quality dum fish fry",
//     "price": 310,
//     "image": "https://similarpng.com/delicious-indian-traditional-dessert-veg-biryani-on-transparent-background-png/"
//   }]
// }

// add a new item to a specific restaurants menu identified by it id
restaurantRoute.put("/restaurants/:id/menu", async (req, res)=>{
    let id = req.params.id
    let payload = req.body;
    let data =await RestaurantModel.findById({_id:id})
    let menu_data = data.menu;
    try {
        menu_data.push(payload)
        await RestaurantModel.findByIdAndUpdate({_id: id}, {menu: menu_data})
        res.send("New menu has been added")
    }catch(error) {
        res.send("Something went wrong")
    }
})

//delete a particular menu item identified by its id from a specific restaurant
restaurantRoute.delete("/restaurants/:id/menu/:menuid", async (req, res)=>{
    let id = req.params.id;
    let menuid = req.params.menuid;
    try {
        const resta = await RestaurantModel.findById(id)
        if(!resta){
            return res.send("'Restaurant not found'")
        }

        //find index of menu
        const menuIndex = resta.menu.findIndex(ele => ele.id === menuid)
        if(menuIndex === -1){
            return res.send("'Menu item not found'")
        }

        //delete menu
        resta.menu.splice(menuIndex, 1)
        await resta.save()
        res.send("Menu item deleted successfully")
    } catch (error) {
        res.send("Something went wrong")
    }
})

module.exports = {restaurantRoute}