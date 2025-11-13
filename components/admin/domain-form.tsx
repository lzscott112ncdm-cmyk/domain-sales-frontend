
'use client';

import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface DomainFormData {
  domain_name: string;
  price_usd: number;
  whatsapp_number: string;
  afternic_url: string;
  city?: string;
  category?: string;
  isFeatured?: boolean;
}

interface DomainFormProps {
  initialData?: Partial<DomainFormData>;
  onSubmit: (data: DomainFormData) => Promise<void>;
  onCancel: () => void;
}

export function DomainForm({ initialData, onSubmit, onCancel }: DomainFormProps) {
  const [formData, setFormData] = useState<DomainFormData>({
    domain_name: initialData?.domain_name || '',
    price_usd: initialData?.price_usd || 0,
    whatsapp_number: initialData?.whatsapp_number || '',
    afternic_url: initialData?.afternic_url || '',
    city: initialData?.city || '',
    category: initialData?.category || '',
    isFeatured: initialData?.isFeatured || false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSubmit(formData);
    } catch (err: any) {
      setError(err.message || 'Failed to save domain');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      <Input
        label="Domain Name *"
        type="text"
        value={formData.domain_name}
        onChange={(e) => setFormData({ ...formData, domain_name: e.target.value })}
        required
        disabled={!!initialData}
      />

      <Input
        label="Price USD *"
        type="number"
        step="0.01"
        value={formData.price_usd}
        onChange={(e) => setFormData({ ...formData, price_usd: parseFloat(e.target.value) })}
        required
      />

      <Input
        label="WhatsApp Number *"
        type="tel"
        placeholder="+5521999998888"
        value={formData.whatsapp_number}
        onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
        required
      />

      <Input
        label="Afternic URL *"
        type="url"
        value={formData.afternic_url}
        onChange={(e) => setFormData({ ...formData, afternic_url: e.target.value })}
        required
      />

      <Input
        label="City"
        type="text"
        value={formData.city}
        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
      />

      <Input
        label="Category"
        type="text"
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="featured"
          checked={formData.isFeatured}
          onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
          className="w-4 h-4 text-primary-600 rounded"
        />
        <label htmlFor="featured" className="text-sm font-medium text-gray-700">
          Featured Domain
        </label>
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : initialData ? 'Update Domain' : 'Create Domain'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
