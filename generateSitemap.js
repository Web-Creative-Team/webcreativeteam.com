// generateSitemap.js
const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');
const path = require('path');

async function generateSitemap() {
  
  if (process.env.NODE_ENV !== 'production') {
    console.log('Това не е production среда. Sitemap няма да се генерира.');
    return;
  }
  const sitemapLinks = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/contacts', changefreq: 'monthly', priority: 0.7 },
    { url: '/ourteam', changefreq: 'monthly', priority: 0.6 },
    { url: '/prices', changefreq: 'weekly', priority: 0.8 },
    { url: '/services/website', changefreq: 'weekly', priority: 0.9 },
    { url: '/services/digitalmarketing', changefreq: 'weekly', priority: 0.9 },
    { url: '/services/design', changefreq: 'weekly', priority: 0.9 },
    { url: '/services/maintenance', changefreq: 'weekly', priority: 0.9 },
    { url: '/articles', changefreq: 'weekly', priority: 0.9 },
    { url: '/articles/67c897cc14160c820ee76f91/details', changefreq: 'monthly', priority: 0.6 },
    { url: '/articles/67c899cf14160c820ee76f9a/details', changefreq: 'monthly', priority: 0.6 },
    { url: '/articles/67c8962f14160c820ee76f8e/details', changefreq: 'monthly', priority: 0.6 },
];


    const sitemapStream = new SitemapStream({ hostname: 'https://webcreativeteam.com' });

  const writeStream = createWriteStream(path.resolve(__dirname, './src/public/sitemap.xml'));
  sitemapStream.pipe(writeStream);

  sitemapLinks.forEach(link => sitemapStream.write(link));
  sitemapStream.end();

  await streamToPromise(sitemapStream);
  console.log('Sitemap успешно създаден.');
}

generateSitemap().catch(console.error);
