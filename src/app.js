const express = require('express')
const path = require("path")
const hbs = require('hbs')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const dbURI = "mongodb+srv://atoaidoo:alNoWotr7XKVoVBN@node-app1.yo5gp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

mongoose.connect(dbURI).then(()=>{  
    console.log("db connected")
}).catch(()=>{
    console.log("not connected")
})

const {
    homeController, secretController,
    loginController, logoutController,
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
} = require('../controllers/user-controller')   




const auth = (req, res, next) =>{
    if(req.session.isAuth){
        next()
    }else{
        res.redirect('/login')
    }
}

const auth2 = (req, res, next)=>{
    if(req.session.isAuth){
        res.redirect('/home')
    }else{
        next()
    }
}
const app = express()

const port = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser())
//Paths
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, "../templates/views")
const partialsPath = path.join(__dirname, "../templates/partials")

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

const pw = "alNoWotr7XKVoVBN"
const store = new MongoDBStore({
    uri: dbURI,
    collection: "todo-sessions"
})

app.use(session({ 
    secret: "D53gxl41G",
    resave: false,
    saveUninitialized: false,
    store: store
}))


app.get("/home",auth, homeController)
app.get('/login',auth2,getLogin)
app.get("/secret",auth, secretController)
app.post('/logout', logoutController)
app.post("/signup",createNewUser)
app.post("/login", loginController)
app.get("/signup", signUpController)
app.get("/users",getAllUsersController)
app.get("/users/:user_id",getSingleUserController)
app.get("/tasks", auth, getUserTasksController)
app.patch("/users/:user_id", auth,  updateUser)
app.delete("/users/:user_id", auth, deleteUser)
app.post("/createTodos", auth, createTodo)
app.post("/addOne",addOne)
app.post("/deleteOne",deleteOne)
app.post("/updateOne",updateOne)

app.listen(port, ()=>{
    console.log("Listenig on current port")
})