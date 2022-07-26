import { model, models, Schema } from 'mongoose'

const ProductsSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true,
        default: 'https://res.cloudinary.com/x-gwkjs-8zn7m-3/image/upload/v1660200423/no-image-available_bitpsk.png'
    },
    images: {
        type: Array,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    checked: {
        type: Boolean,
        default: false
    },
    inStock: {
        type: Number,
        default: 0
    },
    sold: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
},
    {
        timestamps: true
    })

export default models.Product || model('Product', ProductsSchema)