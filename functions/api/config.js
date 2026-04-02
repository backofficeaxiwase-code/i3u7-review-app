export async function onRequestGet({ env }) {
    return new Response(JSON.stringify({
        gmapUrl: "https://search.google.com/local/writereview?placeid=ChIJCZJczN2R918R8lQ8A57siFM"
    }), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=600"
        }
    });
}
