
export function formatCurrency(amount: number, currency: 'USD' | 'BRL'): string {
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
}

export function generateWhatsAppUrl(phoneNumber: string, domainName: string): string {
  const message = encodeURIComponent(`Olá, estou interessado no domínio ${domainName}.`);
  const cleanPhone = phoneNumber.replace(/[^\d+]/g, '');
  return `https://wa.me/${cleanPhone}?text=${message}`;
}

export function normalizeDomain(domain: any) {
  return {
    ...domain,
    domainName: domain.domainName || domain.domain_name,
    priceUsd: domain.priceUsd || domain.price_usd,
    priceBrl: domain.priceBrl || domain.price_brl,
    whatsappNumber: domain.whatsappNumber || domain.whatsapp_number,
    afternicUrl: domain.afternicUrl || domain.afternic_url,
    slug: domain.slug || domain.domain_name,
  };
}
