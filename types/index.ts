
export interface Domain {
  id: number;
  domain_name: string;
  domainName?: string;
  slug?: string;
  price_usd: number;
  priceUsd?: number;
  price_brl: number;
  priceBrl?: number;
  whatsapp_number: string;
  whatsappNumber?: string;
  afternic_url: string;
  afternicUrl?: string;
  active: boolean;
  isFeatured?: boolean;
  city?: string;
  category?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DomainFilters {
  search: string;
  city: string;
  category: string;
}
