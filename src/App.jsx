import { useReducer, useEffect } from 'react';
import React from 'react';
import './App.css';
import Layout from './layout/Layout'; 
import ContainerBlock from './containers/ContainerBlock';
const initialState = {
  isVisible: false,
  tasks: [],
  minDate: '',
};
function reducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_VISIBILITY':
      return { ...state, isVisible: !state.isVisible };
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter(task => task.id !== action.payload) };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? { ...task, ...action.payload.updates } : task
        ),
      };
    case 'SET_MIN_DATE':
      return { ...state, minDate: action.payload };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    fetch('http://localhost:5000/tasks')
      .then(response => response.json())
      .then(data => dispatch({ type: 'SET_TASKS', payload: data }))
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayDate = `${year}-${month}-${day}`;
    dispatch({ type: 'SET_MIN_DATE', payload: todayDate });
  }, []);

  const OpenInterface = () => {
    dispatch({ type: 'TOGGLE_VISIBILITY' });
  };

  const AddTask = (e) => {
    e.preventDefault();
    const form = e.target;
    const values = {
      name: form.name.value,
      date: form.date.value,
      notes: form.notes.value,
      executed: false,
      type: form.type.value,
    };

    fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    })
      .then(response => response.json())
      .then(newTask => {
        dispatch({ type: 'ADD_TASK', payload: newTask });
        form.reset();
        OpenInterface();
      })
      .catch(error => console.error('Error adding task:', error));
  };

  const DeleteTask = (id) => {
    fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        dispatch({ type: 'DELETE_TASK', payload: id });
      })
      .catch(error => console.error('Error deleting task:', error));
  };

  const Executed = (id, bool) => {
    const updatedTask = state.tasks.find(item => item.id === id);
    const newTask = { ...updatedTask, executed: bool };

    fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask),
    })
      .then(() => dispatch({ type: 'UPDATE_TASK', payload: { id, updates: { executed: bool } } }))
      .catch(error => console.error('Error updating task:', error));
  };

  const ChangeTitle = (id, value) => {
    const updatedTask = state.tasks.find(item => item.id === id);
    const newTask = { ...updatedTask, name: value };

    fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask),
    })
      .then(() => dispatch({ type: 'UPDATE_TASK', payload: { id, updates: { name: value } } }))
      .catch(error => console.error('Error updating task:', error));
  };

  const ChangeDate = (id, value) => {
    if (value) {
      const updatedTask = state.tasks.find(item => item.id === id);
      const newTask = { ...updatedTask, date: value };

      fetch(`http://localhost:5000/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      })
        .then(() => dispatch({ type: 'UPDATE_TASK', payload: { id, updates: { date: value } } }))
        .catch(error => console.error('Error updating task:', error));
    }
  };

  const workTasks = state.tasks.filter(task => task.type === 'work');
  const personalTasks = state.tasks.filter(task => task.type === 'personal');
  const othersTask = state.tasks.filter(task => task.type === 'others');

  return (
    <Layout>
      <div className="add_new_tasks">
        <p className="new_task_title">Add a new task</p>
        <button className="speed" onClick={OpenInterface}>
          <img src="/lightning.png" className='lightning' alt="Speed" />
          Speed
        </button>
      </div>
      <div className={`big_black_background ${state.isVisible ? "visible" : ""}`} onClick={OpenInterface}></div>
      <form className={`right_aside ${state.isVisible ? "" : "hidden_right_side"}`} onSubmit={AddTask}>
        <div className='cross_box'>
          <img src="/cross.png" alt="Close" className="cross" onClick={OpenInterface} />
        </div>
        <input type="text" name="name" className='input' placeholder='Add a new task' required />
        <select name="type" className='input' required>
          <option value="personal">Personal</option>
          <option value="work">Work</option>
          <option value="others">Others</option>
        </select>
        <input type="date" name="date" className='input' min={state.minDate} required />
        <textarea name="notes" className='input' placeholder='Add notes' required></textarea>
        <input type="submit" value="Add a task" className='add_task' />
      </form>
      <div className="main_box">
        {workTasks.length > 0 && (
          <ContainerBlock
            date={workTasks}
            DeleteTask={DeleteTask}
            Executed={Executed}
            ChangeTitle={ChangeTitle}
            ChangeDate={ChangeDate}
            minDate={state.minDate}
          />
        )}
        {personalTasks.length > 0 && (
          <ContainerBlock
            date={personalTasks}
            DeleteTask={DeleteTask}
            Executed={Executed}
            ChangeTitle={ChangeTitle}
            ChangeDate={ChangeDate}
            minDate={state.minDate}
          />
        )}
        {othersTask.length > 0 && (
          <ContainerBlock
            date={othersTask}
            DeleteTask={DeleteTask}
            Executed={Executed}
            ChangeTitle={ChangeTitle}
            ChangeDate={ChangeDate}
            minDate={state.minDate}
          />
        )}
      </div>
    </Layout>
  );
}

export default App;

