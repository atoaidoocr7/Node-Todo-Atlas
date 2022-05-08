const mongoose = require('mongoose')
const validator = require('validator')
const bcyrpt = require('bcrypt')
const dbURI = "mongodb+srv://atoaidoo:alNoWotr7XKVoVBN@node-app1.yo5gp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
mongoose.connect(dbURI)

const userSchema = new mongoose.Schema({
    name: String,
    password:{
        type: String,
        required: "true",
        validate(value){
            if(value.length < 8){
                throw new Error("Password must be at least 8 characters")
            }
        },
        trim: true
    },
    email:{
        type: String,
        unique: true,
        required: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email")
            }
        }, 
        trim: true
    }, 
})


//user.tasks is a virtual array, does not exist on database


//This method will grab all the tasks for current user. 
//Virtual property
// const userToTask = async (userId)=>{
//     const user = await User.findById(userId)
//     await user.populate('tasks')
// }


//virtual protocol to get user tasks
userSchema.methods.getUserTasks = async function(){
    userSchema.virtual('tasks', {
        ref: 'Task',
        localField: '_id',
        foreignField:'owner'
    })
    const user = this
    await user.populate('tasks')
    return user.tasks
}






//mongoose middleware to hash password on 'save' lifecycle event
userSchema.pre('save', async function (next) {
    const user = this
    user.password = await bcyrpt.hash(user.password,8)
    next()
})

//delete user tasks when user is removed
userSchema.pre('remove',async function(next){
    const user = this;
    await Task.deleteMany({owner: user._id})
    next()
})
userSchema.statics.findByCredentials = async (email, password) =>{
    const user = await User.find({email:email})
    if(!user){
        throw new Error("Unable to login")
    }
    bcyrpt.compare(password, user.password).then((user)=>{
        return user
    }).catch((e)=>{
        console.log("not  matched")
        throw new Error('Unable to login')
    })
}

const User = mongoose.model('User',userSchema);
module.exports = User