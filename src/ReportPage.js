import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

function ReportPage() {
  const [metrics, setMetrics] = useState({
    customers: 0,
    items: 0,
    orders: 0,
    approvalsPending: 0,
    approvalsApproved: 0,
    invoicesDraft: 0,
    invoicesIssued: 0,
    invoicesPaid: 0,
    defects: 0,
    distributors: 0,
    staffs: 0
  });
  const [trends, setTrends] = useState({
    orders7d: [],
    defects7d: []
  });

  useEffect(() => {
    const fetchCounts = async () => {
      const safeCount = async (table, filter) => {
        try {
          const query = supabase.from(table).select('*', { count: 'exact', head: true });
          const { count, error } = filter ? await filter(query) : await query;
          if (error || typeof count !== 'number') return 0;
          return count;
        } catch (_e) {
          return 0;
        }
      };

      const [
        customers,
        items,
        orders,
        approvalsPending,
        approvalsApproved,
        invoicesDraft,
        invoicesIssued,
        invoicesPaid,
        defects,
        distributors,
        staffs
      ] = await Promise.all([
        safeCount('customers'),
        safeCount('items'),
        safeCount('orders'),
        safeCount('approvals', q => q.eq('status', 'pending')),
        safeCount('approvals', q => q.eq('status', 'approved')),
        safeCount('invoices', q => q.eq('status', 'draft')),
        safeCount('invoices', q => q.eq('status', 'issued')),
        safeCount('invoices', q => q.eq('status', 'paid')),
        safeCount('warehouse_checks', q => q.neq('status', 'ok')),
        safeCount('distributors'),
        safeCount('staffs')
      ]);

      setMetrics({
        customers,
        items,
        orders,
        approvalsPending,
        approvalsApproved,
        invoicesDraft,
        invoicesIssued,
        invoicesPaid,
        defects,
        distributors,
        staffs
      });
    };
    fetchCounts();
  }, []);

  useEffect(() => {
    const start = new Date();
    start.setDate(start.getDate() - 6); // last 7 days inclusive
    start.setHours(0, 0, 0, 0);
    const fromIso = start.toISOString();

    const fetchTrends = async () => {
      const [ordersRes, checksRes] = await Promise.all([
        supabase.from('orders').select('ordered_at').gte('ordered_at', fromIso),
        supabase.from('warehouse_checks').select('checked_at, status').gte('checked_at', fromIso)
      ]);

      const makeBuckets = () => {
        const buckets = new Map();
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(today.getDate() - i);
          d.setHours(0, 0, 0, 0);
          buckets.set(d.toISOString().slice(0, 10), 0);
        }
        return buckets;
      };

      const ordersBuckets = makeBuckets();
      if (!ordersRes.error && Array.isArray(ordersRes.data)) {
        ordersRes.data.forEach(r => {
          if (!r.ordered_at) return;
          const key = new Date(r.ordered_at).toISOString().slice(0, 10);
          if (ordersBuckets.has(key)) ordersBuckets.set(key, ordersBuckets.get(key) + 1);
        });
      }

      const defectsBuckets = makeBuckets();
      if (!checksRes.error && Array.isArray(checksRes.data)) {
        checksRes.data.forEach(r => {
          if (!r.checked_at) return;
          const isDefect = r.status && r.status !== 'ok';
          if (!isDefect) return;
          const key = new Date(r.checked_at).toISOString().slice(0, 10);
          if (defectsBuckets.has(key)) defectsBuckets.set(key, defectsBuckets.get(key) + 1);
        });
      }

      setTrends({
        orders7d: Array.from(ordersBuckets.entries()),
        defects7d: Array.from(defectsBuckets.entries())
      });
    };
    fetchTrends();
  }, []);

  const Card = ({ title, value }) => (
    <div className="card" style={{ minWidth: 180 }}>
      <h3 style={{ margin: 0 }}>{title}</h3>
      <p style={{ fontSize: 28, margin: '8px 0 0 0' }}>{value}</p>
    </div>
  );

  return (
    <div className="dashboard-metrics">
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Card title="Customers" value={metrics.customers} />
        <Card title="Items" value={metrics.items} />
        <Card title="Orders" value={metrics.orders} />
        <Card title="Approvals Pending" value={metrics.approvalsPending} />
        <Card title="Approvals Approved" value={metrics.approvalsApproved} />
        <Card title="Invoices Draft" value={metrics.invoicesDraft} />
        <Card title="Invoices Issued" value={metrics.invoicesIssued} />
        <Card title="Invoices Paid" value={metrics.invoicesPaid} />
        <Card title="Defects (non-OK checks)" value={metrics.defects} />
        <Card title="Distributors" value={metrics.distributors} />
        <Card title="Staffs" value={metrics.staffs} />
      </div>
      <div className="card" style={{ marginTop: 16 }}>
        <h2>Reports & Analytics</h2>
        <p>These default metrics show counts from your Supabase tables. If a table does not exist yet, the count displays as 0.</p>
      </div>
      <div className="card" style={{ marginTop: 16 }}>
        <h3>Last 7 days</h3>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <Trend title="Orders" data={trends.orders7d} color="#3b82f6" />
          <Trend title="Defects" data={trends.defects7d} color="#ef4444" />
        </div>
      </div>
    </div>
  );
}

function Trend({ title, data, color }) {
  const max = Math.max(1, ...data.map(([, v]) => v));
  return (
    <div>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>{title}</div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 100 }}>
        {data.map(([day, value]) => (
          <div key={day} style={{ textAlign: 'center' }}>
            <div style={{
              width: 20,
              height: Math.round((value / max) * 90),
              background: color,
              borderRadius: 4
            }} />
            <div style={{ fontSize: 10, marginTop: 4 }}>{day.slice(5)}</div>
            <div style={{ fontSize: 10 }}>{value}</div>
          </div>
        ))}
        {data.length === 0 && <div style={{ color: '#999' }}>No data</div>}
      </div>
    </div>
  );
}

export default ReportPage;
