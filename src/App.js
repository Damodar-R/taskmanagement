import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Custom Hook for managing form input
function useForm(initialState) {
  const [values, setValues] = useState(initialState);
  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };
  return { values, handleChange, setValues };
}

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [filterPriority, setFilterPriority] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // New state for search
  const { values, handleChange, setValues } = useForm({ title: '', description: '', dueDate: '', priority: 'low', category: '' });

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(savedTasks);
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') setIsDarkMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    document.body.className = isDarkMode ? 'dark-mode' : 'light-mode';
  }, [isDarkMode]);

  // Create or Edit task
  const handleSaveTask = (e) => {
    e.preventDefault();
    const newTask = { ...values, completed: false, id: editingTask ? editingTask.id : Date.now() };

    if (editingTask) {
      setTasks(tasks.map((task) => (task.id === editingTask.id ? newTask : task)));
      setEditingTask(null);
    } else {
      setTasks([...tasks, newTask]);
    }
    setValues({ title: '', description: '', dueDate: '', priority: 'low', category: '' });
    setShowModal(false); // Close the modal after saving
  };

  // Edit task
  const handleEdit = (task) => {
    setEditingTask(task);
    setValues({ title: task.title, description: task.description, dueDate: task.dueDate, priority: task.priority, category: task.category });
    setShowModal(true); // Open the modal for editing
  };

  // Delete task
  const handleDelete = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Mark task as completed
  const handleComplete = (id) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  // Toggle Dark/Light Theme
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Filter tasks by priority
  const filteredTasks = filterPriority === 'all' ? tasks : tasks.filter(task => task.priority === filterPriority);

  // Search tasks based on title or description
  const searchFilteredTasks = filteredTasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Task Management Dashboard</h1>
      <button className="btn btn-secondary btn-sm" onClick={toggleTheme}>
        {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      </button>

      {/* Button to open the modal */}
      <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
        Add Task
      </button>

      {/* Search Input */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search tasks..."
          className="form-control"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Bootstrap Modal for adding/editing tasks */}
      <div className={`modal fade ${showModal ? 'show' : ''}`} tabIndex="-1" style={{ display: showModal ? 'block' : 'none' }} aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{editingTask ? 'Edit Task' : 'Add Task'}</h5>
              <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSaveTask}>
                <div className="mb-3">
                  <input
                    type="text"
                    name="title"
                    value={values.title}
                    onChange={handleChange}
                    placeholder="Task Title"
                    required
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <textarea
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    placeholder="Task Description"
                    required
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="date"
                    name="dueDate"
                    value={values.dueDate}
                    onChange={handleChange}
                    required
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <select name="priority" value={values.priority} onChange={handleChange} className="form-select">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="mb-3">
                  
                </div>
                <button type="submit" className="btn btn-primary">
                  {editingTask ? 'Update Task' : 'Add Task'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <h3>Filter by Priority</h3>
  <div class="btn-group" role="group" aria-label="arial"> 
    <button class="btn btn-info" onClick={() => setFilterPriority('all')}>All</button>
      <button class="btn btn-info" onClick={() => setFilterPriority('low')}>Low</button>
      <button class="btn btn-info" onClick={() => setFilterPriority('medium')}>Medium</button>
      <button class="btn btn-info" onClick={() => setFilterPriority('high')}>High</button></div>

   

      <h3>Task List</h3>
      <div className="task-list">
        {searchFilteredTasks.length === 0 ? (
          <p>No tasks found</p>
        ) : (
          searchFilteredTasks.map((task) => (
            <div key={task.id} className={`task ${task.completed ? 'completed' : ''}`}>
              <div className="task-info">
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <p>Due: {task.dueDate} | Priority: {task.priority}</p>
                {task.category && <p>Category: {task.category}</p>}
              </div>
              <div className="task-actions">
                <button  class="btn btn-primary btn-sm" onClick={() => handleComplete(task.id)}>
                  {task.completed ? 'Completed' : 'Mark as Completed'}
                </button>
                <button className="btn btn-primary" onClick={() => handleEdit(task)}>
                  Update
                </button>
                <button className="btn btn-danger" onClick={() => handleDelete(task.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default App;
