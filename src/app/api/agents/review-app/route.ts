import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 180; // 3 minutes timeout

export async function POST(request: NextRequest) {
  try {
    const { appUrl } = await request.json();

    if (!appUrl) {
      return NextResponse.json(
        { error: 'App URL is required' },
        { status: 400 }
      );
    }

    // Validate URL
    let url: URL;
    try {
      url = new URL(appUrl);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Fetch the web app HTML
    const response = await fetch(appUrl, {
      headers: {
        'User-Agent': 'RoastMyIdea-Bot/1.0',
      },
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `App returned status ${response.status}` },
        { status: response.status }
      );
    }

    const html = await response.text();

    // Basic analysis of the HTML
    const analysis = {
      url: appUrl,
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      
      // Extract metadata
      title: html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || 'No title',
      description: html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)?.[1] || 'No description',
      
      // Check for common frameworks
      hasReact: html.includes('react') || html.includes('__NEXT_DATA__'),
      hasVue: html.includes('vue') || html.includes('data-v-'),
      hasAngular: html.includes('ng-') || html.includes('angular'),
      
      // Check for common elements
      hasLogin: html.toLowerCase().includes('login') || html.toLowerCase().includes('sign in'),
      hasSignup: html.toLowerCase().includes('signup') || html.toLowerCase().includes('sign up') || html.toLowerCase().includes('register'),
      hasDashboard: html.toLowerCase().includes('dashboard'),
      hasAPI: html.toLowerCase().includes('api') || html.includes('/api/'),
      
      // Performance indicators
      hasServiceWorker: html.includes('serviceWorker') || html.includes('sw.js'),
      hasAnalytics: html.includes('analytics') || html.includes('gtag') || html.includes('plausible'),
      
      // Security
      hasHTTPS: url.protocol === 'https:',
      
      // Size
      htmlSize: html.length,
      estimatedLoadTime: html.length / 1024, // Rough estimate in KB
    };

    // Generate summary for judges
    const summary = `
Web App: ${analysis.title}
URL: ${analysis.url}
Status: ${analysis.hasHTTPS ? '🔒 HTTPS' : '⚠️ HTTP'}
Description: ${analysis.description}

Framework Detected: ${
      analysis.hasReact ? 'React/Next.js' :
      analysis.hasVue ? 'Vue.js' :
      analysis.hasAngular ? 'Angular' :
      'Unknown or Vanilla'
    }

Features Detected:
${analysis.hasLogin ? '✓ Login functionality' : '✗ No login detected'}
${analysis.hasSignup ? '✓ Sign up functionality' : '✗ No signup detected'}
${analysis.hasDashboard ? '✓ Dashboard/Admin panel' : '✗ No dashboard detected'}
${analysis.hasAPI ? '✓ API endpoints' : '✗ No API detected'}
${analysis.hasServiceWorker ? '✓ Progressive Web App (PWA)' : '✗ Not a PWA'}
${analysis.hasAnalytics ? '✓ Analytics tracking' : '✗ No analytics'}

Performance:
Page Size: ${(analysis.htmlSize / 1024).toFixed(2)} KB
Security: ${analysis.hasHTTPS ? 'HTTPS enabled ✓' : 'HTTP only (not secure) ✗'}
`;

    return NextResponse.json({
      success: true,
      analysis,
      summary
    });

  } catch (error) {
    console.error('Error reviewing app:', error);
    
    if ((error as Error & { name?: string })?.name === 'AbortError') {
      return NextResponse.json(
        { error: 'App took too long to respond (timeout)' },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to analyze app', message: (error as Error).message },
      { status: 500 }
    );
  }
}
