import React, { useState, useEffect, useContext, createContext } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './App.css';

// Create TaskContext
const TaskContext = createContext();

// TaskProvider Component
const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(savedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task) => setTasks([...tasks, task]);
  const updateTask = (updatedTask) => {
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
  };
  const deleteTask = (taskId) => setTasks(tasks.filter((task) => task.id !== taskId));

  const moveTask = (dragIndex, hoverIndex) => {
    const updatedTasks = [...tasks];
    const [draggedTask] = updatedTasks.splice(dragIndex, 1);
    updatedTasks.splice(hoverIndex, 0, draggedTask);
    setTasks(updatedTasks);
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, moveTask }}>
      {children}
    </TaskContext.Provider>
  );
};

const TaskCard = ({ task, index, onEditClick }) => {
  const { deleteTask, updateTask, moveTask } = useContext(TaskContext);

  const [, ref] = useDrop({
    accept: 'task',
    hover: (item) => {
      if (item.index !== index) {
        moveTask(item.index, index);
        item.index = index;
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'task',
    item: { id: task.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={(node) => drag(ref(node))}
      className="task-card p-4 border rounded-lg shadow-md mb-4 bg-white"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <h2 className="font-semibold">{task.title}</h2>
      <p>{task.description}</p>
      <p>Due: {task.dueDate || 'No due date'}</p>
      <p>Priority: {task.priority}</p>
      <button onClick={() => deleteTask(task.id)} className="bg-red-500 text-white px-2 py-1 rounded">
        Delete
      </button>
      <button onClick={() => updateTask({ ...task, completed: !task.completed })} className="bg-blue-500 text-white px-2 py-1 rounded ml-2">
        {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
      </button>
      <button onClick={() => onEditClick(task)} className="bg-yellow-500 text-white px-2 py-1 rounded ml-2">
        Update
      </button>
    </div>
  );
};

const TaskList = () => {
  const { tasks, updateTask } = useContext(TaskContext);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const handleEditClick = (task) => setTaskToEdit(task);
  const handleUpdateTask = (updatedTask) => {
    updateTask(updatedTask);
    setTaskToEdit(null);
  };

  const filteredTasks = tasks.filter((task) => {
    const today = new Date().toISOString().split('T')[0];

    if (filter === 'today' && task.dueDate !== today) return false;
    if (filter === 'tomorrow') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      if (task.dueDate !== tomorrow.toISOString().split('T')[0]) return false;
    }
    if (filter === 'specific' && selectedDate && task.dueDate !== selectedDate) return false;
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

    return true;
  });

  return (
    <div className="task-list">
      <div className="mb-4">
        <label>Filter by Due Date: </label>
        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            if (e.target.value !== 'specific') setSelectedDate('');
          }}
          className="border p-2 mb-2"
        >
          <option value="all">All</option>
          <option value="today">Today</option>
          <option value="tomorrow">Tomorrow</option>
          <option value="specific">Select by Date</option>
        </select>
        {filter === 'specific' && (
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border p-2 ml-2"
          />
        )}
      </div>

      <div className="mb-4">
        <label>Filter by Priority: </label>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="border p-2 mb-2"
        >
          <option value="all">All</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {filteredTasks.map((task, index) => (
        <TaskCard key={task.id} task={task} index={index} onEditClick={handleEditClick} />
      ))}

      {taskToEdit && (
        <TaskForm
          taskToEdit={taskToEdit}
          onSubmit={handleUpdateTask}
          onCancel={() => setTaskToEdit(null)}
        />
      )}
    </div>
  );
};

const TaskForm = ({ taskToEdit, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(taskToEdit ? taskToEdit.title : '');
  const [description, setDescription] = useState(taskToEdit ? taskToEdit.description : '');
  const [dueDate, setDueDate] = useState(taskToEdit ? taskToEdit.dueDate : '');
  const [priority, setPriority] = useState(taskToEdit ? taskToEdit.priority : 'low');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTask = {
      id: taskToEdit ? taskToEdit.id : Date.now().toString(),
      title,
      description,
      dueDate,
      priority,
      completed: taskToEdit ? taskToEdit.completed : false,
    };
    onSubmit(newTask);
  };

  return (
    <div className="task-form p-4 border rounded-lg shadow-md mb-4 bg-white">
      <h2 className="font-semibold">{taskToEdit ? 'Edit Task' : 'Add New Task'}</h2>
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-4">
        <div className="flex flex-col">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2"
            required
          />
        </div>
        <div className="flex flex-col">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2"
            required
          />
        </div>
        <div className="flex flex-col">
          <label>Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="border p-2"
          />
        </div>
        <div className="flex flex-col">
          <label>Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="border p-2"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="flex items-end">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
            {taskToEdit ? 'Update Task' : 'Add Task'}
          </button>
          
        </div>
      </form>
    </div>
  );
};


const TaskManagementDashboard = () => (
  <TaskProvider>
    <DndProvider backend={HTML5Backend}>
      <div className="dashboard p-4">
        <h1 className="text-2xl font-bold mb-4">Task Management Dashboard</h1>
        <TaskFormWrapper />
        <TaskList />
      </div>
    </DndProvider>
  </TaskProvider>
);

const TaskFormWrapper = () => {
  const { addTask } = useContext(TaskContext);
  return <TaskForm onSubmit={addTask} />;
};

export default TaskManagementDashboard;
