import React from 'react';
import { createRoot } from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';

// Uma única montagem global, fora das seções animadas e do replay.
export function montaAnalytics() {
  const container = document.getElementById('site-analytics');
  if (!container || container.dataset.montado || import.meta.env.DEV) return;
  container.dataset.montado = 'true';
  createRoot(container).render(<Analytics mode="production" />);
}
