import type { VercelRequest, VercelResponse } from '@vercel/node';

async function simulatePerformanceMetrics(responseTime: number, hasViewport: boolean, hasHttps: boolean) {
  const performance = Math.min(100, Math.max(0, 100 - responseTime / 100));
  const accessibility = hasViewport ? 85 : 60;
  const bestPractices = hasHttps ? 90 : 70;
  const seo = hasViewport ? 88 : 65;

  return {
    performance,
    accessibility,
    bestPractices,
    seo
  };
}

function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // Handle CORS
  response.setHeader('Access-Control-Allow-Credentials', 'true');
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  response.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url } = request.body;

    if (!url) {
      return response.status(400).json({ error: 'URL is required' });
    }

    if (!isValidUrl(url)) {
      return response.status(400).json({ error: 'Invalid URL format' });
    }

    const startTime = Date.now();

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const fetchResponse = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!fetchResponse.ok) {
        throw new Error(`HTTP error! status: ${fetchResponse.status}`);
      }

      const html = await fetchResponse.text();
      const responseTime = Date.now() - startTime;
      const hasViewport = html.includes('viewport');
      const hasHttps = url.startsWith('https://');

      const simulatedMetrics = await simulatePerformanceMetrics(responseTime, hasViewport, hasHttps);

      return response.status(200).json({
        data: html,
        lighthouse: simulatedMetrics
      });
    } catch (fetchError: any) {
      clearTimeout(timeout);
      if (fetchError.name === 'AbortError') {
        return response.status(504).json({ error: 'Request timeout' });
      }
      throw fetchError;
    }
  } catch (error: any) {
    console.error('Analysis error:', error);
    return response.status(500).json({ 
      error: 'Failed to analyze website',
      details: error.message
    });
  }
}