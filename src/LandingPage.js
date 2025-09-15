import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [ordersByItem, setOrdersByItem] = useState({});
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    supabase.auth.signOut();
    navigate('/login');
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      // Items with seller (distributor)
      const { data: itemsData } = await supabase
        .from('items')
        .select('id, name, sku, category, price, distributors:distributor_id(name)')
        .order('name');

      // Order totals per item
      const { data: orderRows } = await supabase
        .from('order_items')
        .select('item_id, quantity');

      const totals = {};
      (orderRows || []).forEach(r => {
        const key = r.item_id;
        const qty = Number(r.quantity) || 0;
        totals[key] = (totals[key] || 0) + qty;
      });

      setItems(itemsData || []);
      setOrdersByItem(totals);
      setLoading(false);
    };
    load();
  }, []);

  const maxMin = useMemo(() => {
    const counts = items.map(i => ordersByItem[i.id] || 0);
    if (counts.length === 0) return { max: 0, min: 0 };
    return { max: Math.max(...counts), min: Math.min(...counts) };
  }, [items, ordersByItem]);

  return (
    <div className="landing-container">
      <button className="menu-button" onClick={toggleSidebar}>
        ☰
      </button>

      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <button onClick={goToDashboard}>Dashboard</button>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div className="landing-box" style={{ width: '100%', maxWidth: 1000 }}>
        <h1>Inventory</h1>
        {loading ? (
          <p>Loading products...</p>
        ) : (
          <table className="styled-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Seller</th>
                <th>Price</th>
                <th>Total Ordered</th>
                <th>Tag</th>
              </tr>
            </thead>
            <tbody>
              {items.map(it => {
                const total = ordersByItem[it.id] || 0;
                const seller = it.distributors?.name || '—';
                let tag = '';
                if (items.length > 0) {
                  if (total === maxMin.max && maxMin.max !== maxMin.min) tag = 'Most ordered';
                  if (total === maxMin.min && maxMin.max !== maxMin.min) tag = tag ? tag + ', Least ordered' : 'Least ordered';
                }
                return (
                  <tr key={it.id}>
                    <td>{it.name}</td>
                    <td>{it.sku || '—'}</td>
                    <td>{it.category || '—'}</td>
                    <td>{seller}</td>
                    <td>{typeof it.price === 'number' ? it.price.toFixed(2) : '—'}</td>
                    <td>{total}</td>
                    <td>{tag}</td>
                  </tr>
                );
              })}
              {items.length === 0 && (
                <tr><td colSpan="7">No items yet.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default LandingPage;
