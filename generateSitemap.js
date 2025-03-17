// generateSitemap.js
const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');
const path = require('path');

async function generateSitemap() {
  const sitemapLinks = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/about', changefreq: 'monthly', priority: 0.8 },
    { url: '/contact', changefreq: 'monthly', priority: 0.7 },
    // Добави твоите страници тук
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
