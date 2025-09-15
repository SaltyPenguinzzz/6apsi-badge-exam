import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import LandingPage from './LandingPage';
import Dashboard from './Dashboard';
import CrudPage from './CrudPage';
import ReportPage from './ReportPage';
import ResetPassword from './ResetPassword';
import { supabase } from './supabaseClient';
import './App.css';

function App() {
  const [session, setSession] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('id', { ascending: true });
      if (error) {
        console.error('Error fetching users:', error);
        return;
      }
      setUsers(data || []);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    let isMounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (isMounted) setSession(data.session);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => {
      isMounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const isLoggedIn = !!session;

  const addUser = async (name) => {
    const { data, error } = await supabase
      .from('users')
      .insert([{ name }])
      .select()
      .single();
    if (error) {
      console.error('Error adding user:', error);
      return;
    }
    setUsers(prev => [...prev, data]);
  };

  const updateUser = async (id, newName) => {
    const { data, error } = await supabase
      .from('users')
      .update({ name: newName })
      .eq('id', id)
      .select()
      .single();
    if (error) {
      console.error('Error updating user:', error);
      return;
    }
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, name: data.name } : u)));
  };

  const deleteUser = async (id) => {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    if (error) {
      console.error('Error deleting user:', error);
      return;
    }
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/landing" element={
          isLoggedIn ? <LandingPage /> : <Navigate to="/login" replace />
        } />
        <Route path="/dashboard" element={
          isLoggedIn ? <Dashboard /> : <Navigate to="/login" replace />
        }>
          <Route index element={
            <div className="welcome-container">
              <h2 className="welcome">Welcome to the Dashboard</h2>
            </div>
          } />
          <Route path="crud" element={<CrudPage />} />
          <Route path="report" element={<ReportPage users={users} />} />
        </Route>
        <Route path="/" element={<Navigate to={isLoggedIn ? "/landing" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
