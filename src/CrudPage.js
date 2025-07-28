import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CrudPage() {
  const [users, setUsers] = useState([]);
  const [newUserName, setNewUserName] = useState('');
  const API_URL = 'https://jsonplaceholder.typicode.com/users';

  useEffect(() => {
    axios.get(API_URL).then(res => setUsers(res.data));
  }, []);

  const addUser = async () => {
    if (!newUserName.trim()) return alert("Enter a name!");
    const res = await axios.post(API_URL, { name: newUserName });
    setUsers(prev => [...prev, res.data]);
    setNewUserName('');
  };

  const updateUser = async (id) => {
    const updatedName = prompt('Enter new name:');
    if (!updatedName) return;
    const res = await axios.put(`${API_URL}/${id}`, { name: updatedName });
    setUsers(prev => prev.map(u => u.id === id ? { ...u, name: res.data.name } : u));
  };

  const deleteUser = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  return (
    <div className="card">
      <h2>Manage Users</h2>
      <div className="form-row">
        <input
          type="text"
          value={newUserName}
          placeholder="Enter new user"
          onChange={e => setNewUserName(e.target.value)}
        />
        <button onClick={addUser} className="btn-primary">Add</button>
      </div>
      <ul className="user-list">
        {users.map(user => (
          <li key={user.id}>
            <span>[{user.id}] {user.name}</span>
            <div>
              <button onClick={() => updateUser(user.id)} className="btn-secondary">Edit</button>
              <button onClick={() => deleteUser(user.id)} className="btn-danger">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CrudPage;
