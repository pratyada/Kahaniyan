import { useEffect } from 'react';

// Sets page-specific title + meta description + OG tags.
// Reverts to defaults on unmount.
export function usePageMeta({ title, description, image }) {
  useEffect(() => {
    const prevTitle = document.title;
    const metas = {};

    if (title) document.title = title;

    const set = (prop, content) => {
      let el = document.querySelector(`meta[property="${prop}"]`) || document.querySelector(`meta[name="${prop}"]`);
      if (el) {
        metas[prop] = el.getAttribute('content');
        el.setAttribute('content', content);
      }
    };

    if (description) {
      set('description', description);
      set('og:description', description);
      set('twitter:description', description);
    }
    if (title) {
      set('og:title', title);
      set('twitter:title', title);
    }
    if (image) {
      set('og:image', image);
      set('twitter:image', image);
    }

    return () => {
      document.title = prevTitle;
      Object.entries(metas).forEach(([prop, val]) => {
        const el = document.querySelector(`meta[property="${prop}"]`) || document.querySelector(`meta[name="${prop}"]`);
        if (el && val) el.setAttribute('content', val);
      });
    };
  }, [title, description, image]);
}
