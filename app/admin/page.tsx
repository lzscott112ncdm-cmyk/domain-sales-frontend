
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState('');
  const [tokenInput, setTokenInput] = useState('');
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingDomain, setEditingDomain] = useState<Domain | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if token exists in localStorage
    const storedToken = localStorage.getItem('admin_token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
      loadDomains(storedToken);
    }
  }, []);

  const handleLogin = () => {
    if (!tokenInput.trim()) {
      setError('Please enter a token');
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
    setToken('');
    setIsAuthenticated(false);
    setDomains([]);
  };

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
    try {
      await createDomain(token, data);
      await loadDomains(token);
      setShowForm(false);
      alert('Domain created successfully!');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create domain');
    }
  };

  const handleUpdate = async (data: any) => {
    if (!editingDomain) return;

    try {
      await updateDomain(token, editingDomain.id, data);
      await loadDomains(token);
      setEditingDomain(null);
      setShowForm(false);
      alert('Domain updated successfully!');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update domain');
    }
  };

  const handleDelete = async (domain: Domain) => {
    if (!confirm(`Are you sure you want to delete ${domain.domain_name || domain.domainName}?`)) {
      return;
    }

    try {
      await deleteDomain(token, domain.id);
      await loadDomains(token);
      alert('Domain deleted successfully!');
    } catch (error: any) {
      alert(error.message || 'Failed to delete domain');
    }
  };

  const handleEdit = (domain: Domain) => {
    setEditingDomain(domain);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingDomain(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Admin Login
            </h1>
            <p className="text-gray-600">
              Enter your admin token to access the dashboard
            </p>
            {process.env.NEXT_PUBLIC_ADMIN_HINT && (
              <p className="text-sm text-gray-500 mt-2">
                {process.env.NEXT_PUBLIC_ADMIN_HINT}
              </p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <Input
              type="password"
              label="Admin Token"
              placeholder="Enter your admin token"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
            <Button onClick={handleLogin} className="w-full">
              Login
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-gray-900">
          Admin Dashboard
        </h1>
        <Button variant="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      {showForm ? (
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {editingDomain ? 'Edit Domain' : 'Create New Domain'}
          </h2>
          <DomainForm
            initialData={editingDomain || undefined}
            onSubmit={editingDomain ? handleUpdate : handleCreate}
            onCancel={handleCancelForm}
          />
        </Card>
      ) : (
        <div className="mb-8">
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create New Domain
          </Button>
        </div>
      )}

      <Card>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          All Domains ({domains.length})
        </h2>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading domains...</p>
          </div>
        ) : (
          <DomainList
            domains={domains}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </Card>
    </div>
  );
}
