import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  jsonLd?: object | object[];
}

const BASE_URL = 'https://mantraskill.web.id';
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonical,
  ogImage,
  ogType = 'article',
  jsonLd,
}) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('name', 'description', description);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', ogType);
    setMeta('property', 'og:image', ogImage || DEFAULT_OG_IMAGE);
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', ogImage || DEFAULT_OG_IMAGE);

    if (canonical) {
      setMeta('property', 'og:url', `${BASE_URL}${canonical}`);
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (link) link.href = `${BASE_URL}${canonical}`;
    }

    const scriptEls: HTMLScriptElement[] = [];
    if (jsonLd) {
      const items = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      items.forEach((ld) => {
        const scriptEl = document.createElement('script');
        scriptEl.type = 'application/ld+json';
        scriptEl.textContent = JSON.stringify(ld);
        document.head.appendChild(scriptEl);
        scriptEls.push(scriptEl);
      });
    }

    return () => {
      document.title = prevTitle;
      scriptEls.forEach((el) => el.remove());
    };
  }, [title, description, canonical, ogImage, ogType, jsonLd]);

  return null;
};
