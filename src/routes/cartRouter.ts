// require the express module
import express from "express";
import {CartItem} from "../models/CartItem";
 
// create a new Router object
const cartRouter = express.Router();
 
const cart: CartItem[] = [
    {
        id: 1,
        product: "vegan cheese",
        price: 9,
        quantity: 5
    },
    {
        id: 2,
        product: "bread",
        price: 4,
        quantity: 2
    },
    {
        id: 3,
        product: "onion",
        price: 1,
        quantity: 99
    }
];
 
let nextId = 4;

cartRouter.get("/cart-items", (req, res) => {
    const {maxPrice, prefix, pageSize} = req.query;
    let filteredArray:CartItem[] = cart;
    if (maxPrice) {
        filteredArray = filteredArray.filter((item)=> item.price <= parseInt(maxPrice as string))
    }
    if (prefix) {
        let prefixString = (prefix as string).toLowerCase();
        filteredArray = filteredArray.filter((item)=> item.product.toLowerCase().startsWith(prefixString));
        // let compare1:String[] = prefixString.split("");
        // filteredArray = filteredArray.filter((item)=> {
        //     let compare2:String[] = item.product.split("");
        //     let match:String[] = []
        //     let index = 0;
        //     while(compare1[index] === compare2[index]) {
        //         match.push(compare2[index]);
        //     }
        //     return (compare1.join("") === match.join(""));
        // });
    }
    if (pageSize) {
        filteredArray = filteredArray.slice(0, parseInt(pageSize as string));
    }
    res.status(200);
    res.json(filteredArray);
});

cartRouter.get("/cart-items/:id", (req,res)=> {
    const id: number = parseInt(req.params.id);
    const found: CartItem | undefined = cart.find((item)=> item.id === id)
    // const index: number = cart.findIndex((item)=>)
    if(found) {
        res.status(200);
        res.json(found);
    } else {
        res.status(404);
        res.send(`ID(${id}) Not Found`)
    }
})
 
cartRouter.post("/cart-items", (req,res)=> {
    const newCartItem: CartItem = req.body;
    newCartItem.id = nextId++;
    cart.push(newCartItem);
    res.status(201);
    res.json(newCartItem);
})

cartRouter.put("/cart-items/:id", (req,res)=> {
    const id: number = parseInt(req.params.id);
    const updatedCartItem: CartItem = req.body;
    updatedCartItem.id = id;
    const index: number = cart.findIndex((item) => item.id === id);
    if (index === -1) {
        res.status(404);
        res.send(`The ID of ${id} was not found`);
    } else {
        cart[index] = updatedCartItem;
        res.status(200);
        res.json(updatedCartItem);
    }
})

cartRouter.delete("/cart-items/:id", (req,res)=> {
    const id: number = parseInt(req.params.id);
    const index: number = cart.findIndex((item)=> item.id === id)
    if (index === -1){
        res.status(404);
        res.send(`The ID of ${id} was not found.`)
    } else {
        cart.splice(index,1);
        res.sendStatus(204);
    }
})

export default cartRouter;