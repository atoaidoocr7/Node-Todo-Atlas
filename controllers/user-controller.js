const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const User = require('../Users')
const Task = require('../Tasks')


const getLogin= (req,res)=>{
    res.render('login')
}
const homeController = async (req,res)=>{

    const user = await User.findById(req.session.userId)
    const tasks = await user.getUserTasks()

    const l = tasks.length > 0
    return res.render('home', {
        user: req.session.user,
        todos: tasks,
        length: l
    })
}
const signUpController = (req, res) =>{
    res.render('sign-up')
}
const secretController = (req, res)=>{
    res.send("HI WELCOME YOU HAVE BEEN AUTHORIZED")
}

const logoutController = (req, res) =>{
    req.session.destroy((err)=>{
        if(err){
            res.send(err)
            console.log(err)
        } else{
           console.log("You have been logged out")
           res.redirect('login')
        }
        
    })
}

const createNewUser = async (req, res) =>{
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })
    
    const checkUser = await User.findOne({email: req.body.email})
    if(checkUser != null){
        console.log("Account already exists")
        res.send(checkUser)
    }else{
        user.save().then((v) => {
            console.log(v)
            res.status(200).redirect('login')
        }).catch((e) => {
            console.log('user saving validation failed')
            console.log(e)
            res.status(400).redirect('signup')
        })
    }

}

const loginController = async (req, res)=>{
    try{
        const user = await User.find({email:req.body.email});

        
        if(!user) res.send("User cannot be found")
        if(user){
            bcrypt.compare(req.body.password,user[0].password).then((val)=>{
                if(val){
                    console.log("correct password")
                    if(!req.session.isAuth){
                        req.session.isAuth = true
                        req.session.userId = user[0]._id
                        req.session.user = user[0].name
                        console.log(req.session)
                    }
                    
                    res.redirect('/home')
                }
                else{
                    console.log("password error")
                    res.status(404).ridrect("/sign-up")
                }
            }).catch((e)=>{
                res.status(404).redirect("/login")
            })
        }
    }catch(e){
        console.log("user not found error")
        res.status(404).redirect("/login") 
    }
}


const getAllUsersController = (req, res, next)=>{
    const user = new User(req.body)
    user.save().then(()=>{
        res.send(user)
        console.log("Request body is: ")
        console.log(req.body)
    }).catch((e)=>{
        res.send(e)
    }  )
} 

const getSingleUserController = (req,res)=>{
    User.findById(req.params.user_id).then((val)=>{
        res.send(val)
    }).catch((e)=>{
        console.log(e)
    })
}

const getUserTasksController = async (req,res)=>{
    try{
        const user = await User.findById(req.session.userId)
        const tasks = await user.getUserTasks()
        if(tasks){
            res.status(200).json({
                message:"success",
                todos:tasks
            })
        }else{
            res.send("no tasks found")
        }
        
    }catch(e){
        console.log(e)
        res.send("no tasks found")
    }
}

const updateUser = async (req, res, next)=>{
    try{
        const user = await User.findByIdAndUpdate(req.params.user_id, req.body, {new:true, runValidators: true});
        if(!user){
            return res.status(404).send("User cannot be found")
        }
        res.status(301).send(user)
    }catch(e){
        res.status(404).send(e);
    }
}

const deleteUser = async (req, res, next)=>{
    try{
        const user = await User.findByIdAndDelete(req.params.user_id);
        if(!user) {
            return res.status(404).send("User could not be found")
        }
        res.status(301).send(user)
    }catch(e){
        res.status(404).send(e)
    }
}


const createTodo = (req, res)=>{
    const task = new Task({
        task: req.body.task,
        owner: mongoose.Types.ObjectId(req.session.userId)
    })

    task.save().then(()=>{
        res.status(200).redirect('/home')
    }).catch((e)=>{
        res.send(e)
    })
}
const addOne = async (req, res) =>{
    try{
        const task = new Task({
            task: req.body.task,
            completed: req.body.completed,
            owner: mongoose.Types.ObjectId(req.session.userId),
            id:req.body.id
        })
        console.log(req.body)

        const check = await Task.findOne({id:req.body.id})
        if(!check){
            const validate = await task.save()
            if(validate){
                res.status(200).json({
                    bool: true,
                    message: "success",
                    word: "sweetheart"
                })
    
            }else{
                res.status(400).json({
                    bool: false,
                    message: "failure",
                    word: "dickhead"   
                })
            }
        }else{
            res.status(300).json({
                bool: false,
                message:"cannot add duplicate"
                
            })
        }
    }catch(error){
        console.log(error)
    }
}

const deleteOne = async (req, res)=> {
    try{
        console.log(`Request Body is `)
        console.log(req.body)
        const task = await Task.findOneAndRemove({id:req.body.id})
        if(!task){
            console.log("Task cannot be found")
            return res.status(404).json({
                message:"failure"
            })
        }
        console.log(task)
        console.log("Task deleted")
        res.status(200).json({
            message:"success",
            task:task
        })
    }catch(e){
        res.status(404).json({
            message:"failure"
        })
    }
}


const updateOne = async (req, res) => {
    try{
        // console.log(req.body)
        const task = await Task.findOne({id:req.body.id})
        await task.updateOne({completed:req.body.completed})
        console.log("PRE-Update")
        console.log(task)

        console.log("POST-Update")
        const updatedDoc = await Task.findOne({id:req.body.id})
        console.log(updatedDoc)
        
        res.status(200).json({
            message:"success"
        })
    }catch(e){
        res.status(404).json({
            message:"failure"
        })
    }
}




module.exports = { 
    homeController, 
    secretController, 
    loginController,
    logoutController,
    getAllUsersController,
    getSingleUserController,
    getUserTasksController,
    updateUser,
    deleteUser,
    signUpController,
    getLogin,
    createNewUser,
    createTodo,
    addOne,
    deleteOne,
    updateOne 
}