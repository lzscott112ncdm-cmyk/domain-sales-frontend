
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchDomainBySlug } from '@/lib/api';
import { Domain } from '@/types';
import { formatCurrency, generateWhatsAppUrl, normalizeDomain } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, ExternalLink, MapPin, Tag } from 'lucide-react';

export default function DomainDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [domain, setDomain] = useState<Domain | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDomain();
  }, [slug]);

  const loadDomain = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchDomainBySlug(slug);
      if (!data) {
        setError('Domain not found');
      } else {
        setDomain(data);
      }
    } catch (err) {
      setError('Failed to load domain');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading domain...</p>
        </div>
      </div>
    );
  }

  if (error || !domain) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Domain Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The domain you're looking for doesn't exist or is no longer available.
          </p>
          <Button onClick={() => window.location.href = '/'}>
            Back to Home
          </Button>
        </Card>
      </div>
    );
  }

  const normalized = normalizeDomain(domain);
  const whatsappUrl = generateWhatsAppUrl(normalized.whatsappNumber, normalized.domainName);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {normalized.domainName}
              </h1>
              
              {(domain.city || domain.category) && (
                <div className="flex flex-wrap gap-4 mb-4">
                  {domain.city && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-5 h-5" />
                      <span className="text-lg">{domain.city}</span>
                    </div>
                  )}
                  {domain.category && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Tag className="w-5 h-5" />
                      <span className="text-lg">{domain.category}</span>
                    </div>
                  )}
                </div>
              )}

              {domain.isFeatured && (
                <span className="inline-block bg-yellow-100 text-yellow-800 text-sm font-semibold px-3 py-1 rounded-full">
                  ⭐ Featured Domain
                </span>
              )}
            </div>

            <div className="border-t border-b border-gray-200 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-2">Price in USD</p>
                  <p className="text-4xl font-bold text-primary-600">
                    {formatCurrency(normalized.priceUsd, 'USD')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">Price in BRL</p>
                  <p className="text-4xl font-bold text-gray-700">
                    {formatCurrency(normalized.priceBrl, 'BRL')}
                  </p>
                </div>
              </div>
            </div>

            {domain.description && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  About This Domain
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {domain.description}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button className="w-full flex items-center justify-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Falar no WhatsApp
                </Button>
              </a>

              <a
                href={normalized.afternicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button variant="secondary" className="w-full flex items-center justify-center gap-2">
                  <ExternalLink className="w-5 h-5" />
                  Ver no Afternic
                </Button>
              </a>
            </div>
          </div>
        </Card>

        <div className="text-center">
          <Button variant="secondary" onClick={() => window.location.href = '/'}>
            ← Back to All Domains
          </Button>
        </div>
      </div>
    </div>
  );
}
