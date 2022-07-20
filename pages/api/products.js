/* eslint-disable import/no-anonymous-default-export */
import initDB from "../../helpers/initDB";
import Product from "../../models/Product";

export default async (req, res) =>
{
    switch (req.method) {
        case 'GET':
            await getProducts(req, res)
            break;
        case 'POST':
            await addProduct(req, res)
            break;
    }
}


const getProducts = async (req, res) =>
{
    await initDB();
    try {
        const products = await Product.find()
        res.status(200).json({
            status: 200,
            data: products,
            message: "success"
        })
    } catch (err) {
        console.log({
            status: 500,
            data: err,
            message: "error"
        })
    }
}

const addProduct = async (req, res) =>
{
    await initDB();
    const { name, price, description, image } = req.body
    try {
        if (!name || !price || !description || !image) {
            return res.status(422).json({ error: "Please add all the fields" })
        }
        const product = await new Product({
            name,
            price,
            description,
            image
        }).save()
        res.status(201).json({
            status: 200,
            data: product,
            message: "success"
        })
    } catch (err) {
        res.status(500).json({
            status: 200,
            data: err,
            message: "internal server error"
        })
    }
}