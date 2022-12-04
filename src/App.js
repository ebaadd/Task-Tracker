import React from 'react';
import Header from './components/Header';
import Tasks from './components/Tasks';
import {useState ,useEffect} from 'react'
import AddTask from './components/AddTask';
import Footer from './components/Footer';

const App =() => {
  const [showAddTask,setAddTask] =useState(false)

  const [tasks,setTasks]=useState([])

  useEffect(() => {
    const getTasks = async () => {
      const taskFromserver = await fetchTasks()
      setTasks(taskFromserver)
    }
    getTasks()
  },[])

  //fetch data from json server
  const fetchTasks = async () =>{
    const res= await fetch('http://localhost:5000/tasks')
    const data = await res.json()


    return data
  }
  //fetchtask for toggle reminder
  const fetchTask = async (id) =>{
    const res= await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await res.json()


    return data
  }

  //Add task
  const addtask = async (task) => {
    const res = await fetch('http://localhost:5000/tasks',{method: 'POST',headers:{'Content-type':'application/json'}, body : JSON.stringify(task)})
    const data =await res.json()
    setTasks([...tasks,data])

    // const id =Math.floor(Math.random()* 10000)+1
    // const newTask = {id,...task}
    // setTasks([...tasks,newTask])
  }


  //deletefunction
  const deleteTask= async (id)=>{
    await fetch(`http://localhost:5000/tasks/${id}`,{method:'DELETE'})



    setTasks(tasks.filter((task) =>task.id !== id))
  }

  //toggle remiander
  const  toggleReminder = async(id) =>{
    const tasktoToggle = await fetchTask(id)
    const upTask = { ...tasktoToggle, reminder: !tasktoToggle.reminder}

    const res = await fetch(`http://localhost:5000/tasks/${id}`,{method: 'PUT',headers:{'Content-type':'application/json'}, body : JSON.stringify(upTask)})
    const data =await res.json()
    setTasks(tasks.map((task) => task.id === id ? {...task, reminder: data.reminder} : task))
  }

  return (
    <div className="container">
      <Header onAdd ={() => setAddTask(!showAddTask)} showAdd={showAddTask}/>
      {showAddTask && <AddTask onAdd= {addtask}/>}
      {tasks.length >0 ? <Tasks tasks={tasks} onDelete= {deleteTask} onToggle ={toggleReminder}/> : 'No task to show'}
      <Footer/>
    </div>
  );
}

export default App;
