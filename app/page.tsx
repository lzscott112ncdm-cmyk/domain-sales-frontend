
'use client';

import { useEffect, useState } from 'react';
import { fetchDomains } from '@/lib/api';
import { Domain, DomainFilters } from '@/types';
import { DomainCard } from '@/components/domain-card';
import { DomainFilters as DomainFiltersComponent } from '@/components/domain-filters';

export default function HomePage() {
  const [allDomains, setAllDomains] = useState<Domain[]>([]);
  const [filteredDomains, setFilteredDomains] = useState<Domain[]>([]);
  const [featuredDomains, setFeaturedDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    loadDomains();
  }, []);

  const loadDomains = async () => {
    setLoading(true);
    try {
      const data = await fetchDomains({ isSold: false });
      const activeDomains = data.filter((d: Domain) => d.active !== false);
      
      setAllDomains(activeDomains);
      setFilteredDomains(activeDomains);
      setFeaturedDomains(activeDomains.filter((d: Domain) => d.isFeatured === true));

      // Extract unique cities and categories
      const uniqueCities = [...new Set(activeDomains.map((d: Domain) => d.city).filter(Boolean))];
      const uniqueCategories = [...new Set(activeDomains.map((d: Domain) => d.category).filter(Boolean))];
      
      setCities(uniqueCities as string[]);
      setCategories(uniqueCategories as string[]);
    } catch (error) {
      console.error('Error loading domains:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters: DomainFilters) => {
    let filtered = [...allDomains];

    if (filters.search) {
      filtered = filtered.filter((d) =>
        (d.domain_name || d.domainName || '')
          .toLowerCase()
          .includes(filters.search.toLowerCase())
      );
    }

    if (filters.city) {
      filtered = filtered.filter((d) => d.city === filters.city);
    }

    if (filters.category) {
      filtered = filtered.filter((d) => d.category === filters.category);
    }

    setFilteredDomains(filtered);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading domains...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Premium Domain Names
        </h1>
        <p className="text-xl text-gray-600">
          Find the perfect domain for your next project
        </p>
      </div>

      {featuredDomains.length > 0 && (
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Featured Domains
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDomains.map((domain) => (
              <DomainCard key={domain.id} domain={domain} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          All Domains
        </h2>

        <DomainFiltersComponent
          onFilterChange={handleFilterChange}
          cities={cities}
          categories={categories}
        />

        {filteredDomains.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No domains found matching your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDomains.map((domain) => (
              <DomainCard key={domain.id} domain={domain} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
