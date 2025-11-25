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

  const [isRecalcLoading, setIsRecalcLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState('');
  const [tokenInput, setTokenInput] = useState('');
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingDomain, setEditingDomain] = useState<Domain | null>(null);
  const [error, setError] = useState('');

  // -----------------------------------------
  // FIXED: REAL AUTH CHECK
  // -----------------------------------------
  useEffect(() => {
    const stored = localStorage.getItem('admin_token');
    if (stored && stored === ADMIN_TOKEN) {
      setIsAuthenticated(true);
      setToken(stored);
      loadDomains(stored);
    }
  }, []);

  const handleLogin = () => {
    if (!tokenInput.trim()) {
      setError('Please enter a token');
      return;
    }

    if (tokenInput !== ADMIN_TOKEN) {
      setError('Invalid admin token');
      return;
    }

    localStorage.setItem('admin_token', tokenInput);
    setToken(tokenInput);
    setIsAuthenticated(true);
    setError('');
    loadDomains(tokenInput);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    setToken('');
    setDomains([]);
  };

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
        alert(`Error: ${data.error || 'Failed to recalculate BRL prices.'}`);
        return;
      }

      alert(`Updated BRL prices for ${data.updated} domains.`);
    } catch (e) {
      alert('Unexpected error while recalculating BRL prices.');
    } finally {
      setIsRecalcLoading(false);
    }
  }

  const loadDomains = async (authToken: string) => {
    setLoading(true);
    try {
      const data = await fetchDomains({});
      setDomains(data);
    } catch (error) {
      console.error('Error loading domains:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: any) => {
    await createDomain(token, data);
    await loadDomains(token);
    setShowForm(false);
    alert('Domain created!');
  };

  const handleUpdate = async (data: any) => {
    if (!editingDomain) return;

    await updateDomain(token, editingDomain.id, data);
    await loadDomains(token);
    setEditingDomain(null);
    setShowForm(false);
    alert('Domain updated!');
  };

  const handleDelete = async (domain: Domain) => {
    if (!confirm(`Delete ${domain.domain_name || domain.domainName}?`)) return;

    await deleteDomain(token, domain.id);
    await loadDomains(token);
    alert('Domain deleted.');
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto p-6">
          <div className="text-center mb-6">
            <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
            <p className="text-gray-600">Enter your admin token</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Admin token"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />

            <Button className="w-full" onClick={handleLogin}>
              Login
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">

      {/* Top Bar */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>

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

      {/* Form */}
      {showForm ? (
        <Card className="mb-8 p-6">
          <h2 className="text-2xl font-bold mb-6">
            {editingDomain ? 'Edit Domain' : 'Create Domain'}
          </h2>

          <DomainForm
            initialData={editingDomain || undefined}
            onSubmit={editingDomain ? handleUpdate : handleCreate}
            onCancel={() => {
              setShowForm(false);
              setEditingDomain(null);
            }}
          />
        </Card>
      ) : (
        <div className="mb-8">
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="w-5 h-5" /> Create New Domain
          </Button>
        </div>
      )}

      {/* Domain List */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">All Domains ({domains.length})</h2>

        {loading ? (
          <p className="text-gray-600 text-center py-10">Loading...</p>
        ) : (
          <DomainList
            domains={domains}
            onEdit={setEditingDomain}
            onDelete={handleDelete}
          />
        )}
      </Card>
    </div>
  );
}
