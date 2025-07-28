import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ReportPage() {
  const [users, setUsers] = useState([]);
  const API_URL = 'https://jsonplaceholder.typicode.com/users';

  useEffect(() => {
    axios.get(API_URL).then(res => setUsers(res.data));
  }, []);

  return (
    <div className="card">
      <h2>User Report</h2>
      <table className="styled-table">
        <thead>
          <tr><th>ID</th><th>Name</th></tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReportPage;
