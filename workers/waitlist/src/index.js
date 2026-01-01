/**
 * Rails LLM Course Waitlist Worker
 *
 * Handles form submissions and stores emails in Cloudflare KV.
 */

const ALLOWED_ORIGINS = [
  'https://damiangalarza.com',
  'http://localhost:1313',
];

function getCorsHeaders(request) {
  const origin = request.headers.get('Origin');
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export default {
  async fetch(request, env) {
    const corsHeaders = getCorsHeaders(request);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Only allow POST
    if (request.method !== 'POST') {
      return new Response('Method not allowed', {
        status: 405,
        headers: corsHeaders,
      });
    }

    try {
      const data = await request.formData();
      const email = data.get('email')?.trim().toLowerCase();
      const origin = request.headers.get('Origin');
      const baseUrl = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

      // Validate email
      if (!email || !isValidEmail(email)) {
        return Response.redirect(
          `${baseUrl}/rails-llm-course/?error=invalid-email`,
          303
        );
      }

      // Check if already subscribed
      const existing = await env.WAITLIST_KV.get(`email:${email}`);
      if (existing) {
        // Already on the list - still show success
        return Response.redirect(
          `${baseUrl}/rails-llm-course/thanks/`,
          303
        );
      }

      // Store in KV
      const entry = {
        email,
        timestamp: new Date().toISOString(),
        source: 'rails-llm-course',
      };

      await env.WAITLIST_KV.put(`email:${email}`, JSON.stringify(entry));

      // Redirect to success page
      return Response.redirect(
        `${baseUrl}/rails-llm-course/thanks/`,
        303
      );
    } catch (err) {
      console.error('Waitlist error:', err);
      const origin = request.headers.get('Origin');
      const baseUrl = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
      return Response.redirect(
        `${baseUrl}/rails-llm-course/?error=server`,
        303
      );
    }
  },
};

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
