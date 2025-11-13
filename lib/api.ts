
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001';

export async function fetchDomains(filters?: {
  isSold?: boolean;
  isFeatured?: boolean;
}): Promise<any[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.isSold !== undefined) {
      params.append('isSold', String(filters.isSold));
    }
    if (filters?.isFeatured !== undefined) {
      params.append('isFeatured', String(filters.isFeatured));
    }

    const url = `${API_BASE}/api/domains${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url, { cache: 'no-store' });
    
    if (!response.ok) {
      throw new Error('Failed to fetch domains');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching domains:', error);
    return [];
  }
}

export async function fetchDomainBySlug(slug: string): Promise<any | null> {
  try {
    const url = `${API_BASE}/api/domain/${slug}`;
    const response = await fetch(url, { cache: 'no-store' });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching domain:', error);
    return null;
  }
}

export async function createDomain(token: string, data: any): Promise<any> {
  const url = `${API_BASE}/api/admin/domain`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create domain');
  }

  return await response.json();
}

export async function updateDomain(token: string, id: number, data: any): Promise<any> {
  const url = `${API_BASE}/api/admin/domain/${id}`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update domain');
  }

  return await response.json();
}

export async function deleteDomain(token: string, id: number): Promise<any> {
  const url = `${API_BASE}/api/admin/domain/${id}`;
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete domain');
  }

  return await response.json();
}
