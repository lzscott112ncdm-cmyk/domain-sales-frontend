
'use client';

import Link from 'next/link';
import { Domain } from '@/types';
import { formatCurrency, normalizeDomain } from '@/lib/utils';
import { Card } from './ui/card';
import { MapPin, Tag } from 'lucide-react';

interface DomainCardProps {
  domain: Domain;
}

export function DomainCard({ domain }: DomainCardProps) {
  const normalized = normalizeDomain(domain);

  return (
    <Link href={`/domains/${normalized.slug}`}>
      <Card className="hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <h3 className="text-xl font-bold text-gray-900 truncate">
              {normalized.domainName}
            </h3>
            {domain.isFeatured && (
              <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                Featured
              </span>
            )}
          </div>

          {(domain.city || domain.category) && (
            <div className="flex flex-wrap gap-2">
              {domain.city && (
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{domain.city}</span>
                </div>
              )}
              {domain.category && (
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Tag className="w-4 h-4" />
                  <span>{domain.category}</span>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col gap-1 pt-4 border-t border-gray-200">
            <div className="text-2xl font-bold text-primary-600">
              {formatCurrency(normalized.priceUsd, 'USD')}
            </div>
            <div className="text-lg text-gray-600">
              {formatCurrency(normalized.priceBrl, 'BRL')}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
