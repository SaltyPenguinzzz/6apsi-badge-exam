import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from './supabaseClient';

function CrudPage() {
  const entities = useMemo(() => ([
    { key: 'users', label: 'Users' },
    { key: 'customers', label: 'Customers (Retailers/Stores)' },
    { key: 'distributors', label: 'Distributors' },
    { key: 'purchasers', label: 'Purchasers' },
    { key: 'warehouse_checks', label: 'Warehouse Checks' },
    { key: 'staffs', label: 'Staffs' },
    { key: 'assignments', label: 'CSR Assignments' },
    { key: 'approvals', label: 'TL Approvals' },
    { key: 'invoices', label: 'Accounting (Invoices/Charges)' }
  ]), []);

  const [selectedEntity, setSelectedEntity] = useState('customers');
  const [items, setItems] = useState([]);
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from(selectedEntity)
        .select('id, name')
        .order('id', { ascending: true });
      if (error) {
        console.error('Error fetching', selectedEntity, error);
        setItems([]);
      } else {
        setItems(data || []);
      }
      setLoading(false);
    };
    fetchItems();
  }, [selectedEntity]);

  const handleAdd = async () => {
    if (!newName.trim()) return alert('Enter a name!');
    const { data, error } = await supabase
      .from(selectedEntity)
      .insert([{ name: newName.trim() }])
      .select()
      .single();
    if (error) {
      console.error('Error adding', selectedEntity, error);
      return;
    }
    setItems(prev => [...prev, data]);
    setNewName('');
  };

  const handleUpdate = async (id) => {
    const newValue = prompt('Enter new name:');
    if (!newValue) return;
    const { data, error } = await supabase
      .from(selectedEntity)
      .update({ name: newValue })
      .eq('id', id)
      .select()
      .single();
    if (error) {
      console.error('Error updating', selectedEntity, error);
      return;
    }
    setItems(prev => prev.map(it => (it.id === id ? { ...it, name: data.name } : it)));
  };

  const handleDelete = async (id) => {
    const { error } = await supabase
      .from(selectedEntity)
      .delete()
      .eq('id', id);
    if (error) {
      console.error('Error deleting', selectedEntity, error);
      return;
    }
    setItems(prev => prev.filter(it => it.id !== id));
  };

  return (
    <div className="card">
      <h2>Inventory CRUD</h2>

      <div className="form-row" style={{ gap: 8, alignItems: 'center' }}>
        <label htmlFor="entity">Entity:</label>
        <select id="entity" value={selectedEntity} onChange={e => setSelectedEntity(e.target.value)}>
          {entities.map(ent => (
            <option key={ent.key} value={ent.key}>{ent.label}</option>
          ))}
        </select>

        <input
          type="text"
          value={newName}
          placeholder={`New ${entities.find(e => e.key === selectedEntity)?.label || 'Item'}`}
          onChange={e => setNewName(e.target.value)}
        />
        <button onClick={handleAdd} className="btn-primary">Add</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="user-list">
          {items.map((item, index) => (
            <li key={item.id}>
              <span>#{index + 1} {item.name}</span>
              <div>
                <button onClick={() => handleUpdate(item.id)} className="btn-secondary">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="btn-danger">Delete</button>
              </div>
            </li>
          ))}
          {items.length === 0 && (
            <li>
              <span>No records yet.</span>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

export default CrudPage;
