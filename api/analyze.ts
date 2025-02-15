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

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  if (request.method === 'OPTIONS') {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return response.status(200).end();
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url } = request.body;
    const startTime = Date.now();

    const fetchResponse = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const html = await fetchResponse.text();
    const responseTime = Date.now() - startTime;
    const hasViewport = html.includes('viewport');
    const hasHttps = url.startsWith('https://');

    const simulatedMetrics = await simulatePerformanceMetrics(responseTime, hasViewport, hasHttps);

    response.setHeader('Access-Control-Allow-Origin', '*');
    return response.status(200).json({
      data: html,
      lighthouse: simulatedMetrics
    });
  } catch (error) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    return response.status(500).json({ error: 'Failed to analyze website' });
  }
}