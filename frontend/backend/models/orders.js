import mongoose from 'mongoose'


const ordersSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    address: String,
    city: String,
    post_code: String,
    email: String,
    phone: String,
    shipping_method: String,
    peyment_method: String,
    product: String
})

export default mongoose.model('Orders', ordersSchema, 'Orders')