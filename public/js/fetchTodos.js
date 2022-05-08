const form = document.getElementById('form')
const input= document.getElementById('input')
const todosUL = document.getElementById('todos')


const getAllTasks = async () =>{
    let arr = []
    try{
        const response = await fetch("http://localhost:3000/tasks");
        if(response.ok){
            const jsonResponse = await response.json()
            jsonResponse.todos.forEach((item)=>{
                arr.push(item)
            })
        }   
        else{
            throw new Error("Request Failed")
        }
    }catch(e){
        console.log(e)
    }
    return arr;
}

getAllTasks().then((val)=>{
    val.forEach((item)=>{
        addTodo(item)
    })
})








form.addEventListener('submit',(event)=>{
    event.preventDefault()
    addTodo()   
})



const addTodo = async (todo) =>{
    let todoText = input.value

    if(todo){
        todoText = todo.task
    }
    if(todoText){
        const todoElement = document.createElement('li')
        if(!todo){
            todoElement.setAttribute("id",Date.now().toString())
        }

        if(todo){
            todoElement.setAttribute("id",todo.id.toString())
        }
        
        if(todo && todo.completed=='true'){
            todoElement.classList.add('completed')
        }
        

        todoElement.innerText = todoText

        todoElement.addEventListener('click',()=>{
            todoElement.classList.toggle('completed')
            updateOne(todoElement)
        })
        
        todoElement.addEventListener('contextmenu',(event)=>{
            event.preventDefault()
            todoElement.remove()
            deleteOne(todoElement)
        })
        todosUL.appendChild(todoElement)
        if(!todo){
            addOne(todoElement)
        }
        
        input.value = ''
    }
    
}


const addOne = async (todoElement) =>{
    try{
        const response = await fetch("http://localhost:3000/addOne",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({task:todoElement.innerText, completed:todoElement.classList.contains('completed'),id:todoElement.id})
        })
        if(response.ok){
            const jsonResponse = await response.json()
            return jsonResponse
        }
        else{
            throw new Error("Request Failed")
        }
    }catch(err){
        console.log(err)
    } 
};

const deleteOne = async (task) =>{
    try{
        const response = await fetch("http://localhost:3000/deleteOne",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id:task.id})
        })
        console.log(task.id)

        if(response.ok){
            const jsonResponse = await response.json()
            return jsonResponse
        }

        else{
            throw new Error("Request Failed")
        }

    }catch(err){
        console.log(err)
    } 
}
const updateOne = async (task) =>{
    try{
        const response = await fetch("http://localhost:3000/updateOne",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id:task.id, completed: task.classList.contains('completed')})
        })

        console.log(task.classList.contains('completed'))

        if(response.ok){
            const jsonResponse = await response.json()
            return jsonResponse
        }

        else{
            throw new Error("Request Failed")
        }

    }catch(err){
        console.log(err)
    } 
}







