const mongoose = require('mongoose')
const dbURI = "mongodb+srv://atoaidoo:alNoWotr7XKVoVBN@node-app1.yo5gp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
mongoose.connect(dbURI)

const taskSchema = new mongoose.Schema({
    task: String,
    completed:{
        type: String,
        default: false
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref:'User'
    }, 
    id:{
        type:String,
        unique:true
    }
     
})
const Task = mongoose.model('Task',taskSchema)
module.exports = Task