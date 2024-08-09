import { useState } from 'react'
import React from 'react'
import './App.css'
import { useEffect } from 'react'
import Layout from './layoutt/Layout'
import ContainerBlock from './containers/ContainerBlock'
function App() {
  let [isVisible, setIsVisible] = useState(false);
  function OpenInterface() {
    setIsVisible(!isVisible);
  }
  let [arr, setArr] = useState([]);

  useEffect(() => {
    let savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setArr(JSON.parse(savedTasks));
    } else {
      setArr([]);
    }
  }, []);

  let [minDate, setMinDate] = useState('');
  useEffect(() => {
    let today = new Date();
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, '0');
    let day = String(today.getDate()).padStart(2, '0');
    let todayDate = `${year}-${month}-${day}`;
    setMinDate(todayDate);
  }, []);


  function AddTask(e) {
    e.preventDefault();
    let randomNumber = Math.random();
    let values = {
      id: randomNumber,
      name: e.target.children.name.value,
      date: e.target.children.date.value,
      notes: e.target.children.notes.value,
      executed: false,
      type: e.target.children.type.value,
    };

    setArr(prevArr => {
      let newArr = [...prevArr, values];
      localStorage.setItem('tasks', JSON.stringify(newArr));
      return newArr;
    });

    for (let item of e.target.children) {
      if (item.name !== "type") {
        item.value = '';
      }
    }
  }

  function DeleteTask(id) {
    setArr(prevArr => {
      let newArr = prevArr.filter(item => item.id !== id);
      localStorage.setItem('tasks', JSON.stringify(newArr));
      return newArr;
    });
  }

  function Executed(id, bool) {
    setArr(prevArr => {
      let newArr = prevArr.map(item =>
        item.id === id ? { ...item, executed: bool } : item
      );
      localStorage.setItem('tasks', JSON.stringify(newArr));
      return newArr;
    });
  }

  function ChangeTitle(id, value) {
    setArr(prevArr => {
      let newArr = prevArr.map(item =>
        item.id === id ? { ...item, name: value } : item
      );
      localStorage.setItem('tasks', JSON.stringify(newArr));
      return newArr;
    });
  }

  function ChangeDate(id, value) {
    console.log(value);

    if (value !== "" && value !== null && value !== undefined) {
      setArr(prevArr => {
        let newArr = prevArr.map(item =>
          item.id === id ? { ...item, date: value } : item
        );
        localStorage.setItem('tasks', JSON.stringify(newArr));
        return newArr;
      });
    }
  }
  let workTasks = arr.filter(task => task.type === 'work')
  let personalTasks = arr.filter(task => task.type === 'personal')
  let othersTask = arr.filter(task => task.type === 'others')
  return (
    <>
      <Layout>
        <div className="add_new_tasks">
          <p className="new_task_title">Add a new task</p>
          <button className="speed" onClick={OpenInterface}>
            <img src="./lightning.png" className='lightning' />
            Speed
          </button>
        </div>
        <div className={`big_black_background ${isVisible ? "visible" : ""}`} onClick={OpenInterface}></div>
        <form className={`right_aside ${isVisible ? "" : "hidden_right_side"}`} onSubmit={AddTask}>
         <div className='cross_box'> <img src="./cross.png" alt="" className="cross" onClick={OpenInterface}/> </div> 
          <input type="text" name="name" id="" className='input' placeholder='Add a new task' required />
          <select name="type" id="" className='input' required>
            <option value="personal">Personal</option>
            <option value="work">Work</option>
            <option value="others">Others</option>
          </select>
          <input type="date" name="date" id="" className='input' min={minDate} required />
          <textarea name="notes" id="" className='input' placeholder='Add notes' required></textarea>
          <input type="submit" value="Add a task" className='add_task' />
        </form>
        <div className="main_box">
          {workTasks.length > 0 && <ContainerBlock date={workTasks} DeleteTask={DeleteTask} Executed={Executed} ChangeTitle={ChangeTitle} ChangeDate={ChangeDate} minDate={minDate}></ContainerBlock>}
          {personalTasks.length > 0 && <ContainerBlock date={personalTasks} DeleteTask={DeleteTask} Executed={Executed} ChangeTitle={ChangeTitle} ChangeDate={ChangeDate} minDate={minDate}></ContainerBlock>}
          {othersTask.length > 0 && <ContainerBlock date={othersTask} DeleteTask={DeleteTask} Executed={Executed} ChangeTitle={ChangeTitle} ChangeDate={ChangeDate} minDate={minDate}></ContainerBlock>}
        </div>
      </Layout>
    </>
  )
}

export default App
