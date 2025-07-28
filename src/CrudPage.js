import React, { useState } from 'react';

function CrudPage({ users, addUser, updateUser, deleteUser }) {
  const [newUserName, setNewUserName] = useState('');

  const handleAdd = () => {
    if (!newUserName.trim()) return alert("Enter a name!");
    addUser(newUserName);
    setNewUserName('');
  };

  const handleUpdate = (id) => {
    const newName = prompt('Enter new name:');
    if (newName) updateUser(id, newName);
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
        <button onClick={handleAdd} className="btn-primary">Add</button>
      </div>

      <ul className="user-list">
        {users.map((user, index) => (
          <li key={user.id}>
            <span>#{index + 1} {user.name}</span>
            <div>
              <button onClick={() => handleUpdate(user.id)} className="btn-secondary">Edit</button>
              <button onClick={() => deleteUser(user.id)} className="btn-danger">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CrudPage;
