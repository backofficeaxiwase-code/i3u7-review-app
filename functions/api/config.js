export async function onRequestGet({ env }) {
    // Return public configuration values
    // Sensitive keys like GEMINI_API_KEY should NEVER be returned here
    return new Response(JSON.stringify({
        gmapUrl: env.GMAP_REVIEW_URL || "https://maps.google.com" // Fallback or strict error
    }), {
        headers: {
            "Content-Type": "application/json",
            // Cache for speed, but short enough to allow changes
            "Cache-Control": "public, max-age=600"
        }
    });
}

