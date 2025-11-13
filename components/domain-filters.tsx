
'use client';

import { useState } from 'react';
import { Input } from './ui/input';
import { Select } from './ui/select';
import { Search } from 'lucide-react';

interface DomainFiltersProps {
  onFilterChange: (filters: { search: string; city: string; category: string }) => void;
  cities: string[];
  categories: string[];
}

export function DomainFilters({ onFilterChange, cities, categories }: DomainFiltersProps) {
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('');

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onFilterChange({ search: value, city, category });
  };

  const handleCityChange = (value: string) => {
    setCity(value);
    onFilterChange({ search, city: value, category });
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    onFilterChange({ search, city, category: value });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search domains..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>

        <Select
          value={city}
          onChange={(e) => handleCityChange(e.target.value)}
          options={[
            { value: '', label: 'All Cities' },
            ...cities.map(c => ({ value: c, label: c })),
          ]}
        />

        <Select
          value={category}
          onChange={(e) => handleCategoryChange(e.target.value)}
          options={[
            { value: '', label: 'All Categories' },
            ...categories.map(c => ({ value: c, label: c })),
          ]}
        />
      </div>
    </div>
  );
}
