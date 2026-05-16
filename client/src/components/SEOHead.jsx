// Per-route SEO meta tags using react-helmet-async.

import { Helmet } from 'react-helmet-async';

export default function SEOHead({ title, description, path, type = 'website' }) {
  const fullTitle = title ? `${title} | My Sleepy Tale` : 'My Sleepy Tale — Bedtime Stories for Kids';
  const url = `https://mysleepytale.com${path || ''}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
    </Helmet>
  );
}
