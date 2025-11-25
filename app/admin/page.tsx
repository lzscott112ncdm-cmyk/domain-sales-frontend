'use client';

import { useEffect, useState } from 'react';
import { fetchDomains, createDomain, updateDomain, deleteDomain } from '@/lib/api';
import { Domain } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DomainList } from '@/components/admin/domain-list';
import { DomainForm } from '@/components/admin/domain-form';
import { Lock, Plus } from 'lucide-react';

export default function AdminPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;
  const ADMIN_TOKEN = process.env.NEXT_PUBLIC_ADMIN_TOKEN!;

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState('');
  const [tokenInput, setTokenInput] = useState('');
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingDomain, setEditingDomain] = useState<Domain | null>(null);
  const [error, setError] = useState('');

  const [isRecalcLoading, setIsRecalcLoading] = useState(false);

  async function handleRecalculateBRL() {
    try {
      setIsRecalcLoading(true);

      const res = await fetch(`${API_BASE}/api/admin/recalculate-brl`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(`Error: ${data.error || 'Failed to recalc.'}`);
        return;
      }

      alert(`Updated BRL prices for ${data.updated} domains.`);
    } catch (err) {
      alert('Unexpected error.');
    } finally {
      setIsRecalcLoading(false);
    }
  }

  useEffect(() => {
    const stored = localStorage.getItem('admin_token');
    if (stored && stored === ADMIN_TOKEN) {
      setToken(stored);
      setIsAuthenticated(true);
      loadDomains(stored);
    }
  }, []);

  const handleLogin = () => {
    if (tokenInput === ADMIN_TOKEN) {
      localStorage.setItem('admin_token', tokenInput);
      setToken(tokenInput);
      setIsAuthenticated(true);
      setError('');
      loadDomains(tokenInput);
    } else {
      setError('Incorrect token.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    setToken('');
    setDomains([]);
  };

  const loadDomains = async (authToken: string) => {
    setLoading(true);
    try {
      const data = await fetchDomains({});
      setDomains(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto p-6">
          <div className="text-center mb-6">
            <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold">Admin Login</h1>
            <p className="text-gray-600 mt-2">Enter your admin token</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <Input
            type="password"
            placeholder="Admin token"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
          />

          <Button onClick={handleLogin} className="w-full mt-4">
            Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>

        <div className="flex gap-3">
          <Button
            onClick={handleRecalculateBRL}
            disabled={isRecalcLoading}
            variant="outline"
          >
            {isRecalcLoading ? 'Recalculando…' : 'Recalcular BRL'}
          </Button>

          <Button variant="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      {/* CREATE BUTTON */}
      {showForm ? (
        <Card className="mb-8 p-6">
          <h2 className="text-2xl font-bold mb-6">
            {editingDomain ? 'Edit Domain' : 'Create New Domain'}
          </h2>

          <DomainForm
            initialData={editingDomain || undefined}
            onSubmit={editingDomain ? updateDomain : createDomain}
            onCancel={() => {
              setShowForm(false);
              setEditingDomain(null);
            }}
          />
        </Card>
      ) : (
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2 mb-8">
          <Plus className="w-5 h-5" />
          Create New Domain
        </Button>
      )}

      {/* DOMAIN LIST */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">All Domains ({domains.length})</h2>

        {loading ? (
          <div className="text-center py-12">Loading…</div>
        ) : (
          <DomainList
            domains={domains}
            onEdit={(d) => {
              setEditingDomain(d);
              setShowForm(true);
            }}
            onDelete={async (d) => {
              if (confirm(`Delete ${d.domain_name}?`)) {
                await deleteDomain(token, d.id);
                loadDomains(token);
              }
            }}
          />
        )}
      </Card>
    </div>
  );
}
