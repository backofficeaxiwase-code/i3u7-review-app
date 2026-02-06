export async function onRequestPost({ request, env }) {
    try {
        const body = await request.json();
        const { context, features = [], freeMessage = "" } = body;

        if (!env.GEMINI_API_KEY) {
            return new Response(JSON.stringify({ ok: false, error: "No API Key" }), { status: 500 });
        }

        const prompt = generateSaunaPrompt(context, features, freeMessage);

        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { temperature: 0.75, maxOutputTokens: 300 }
                })
            }
        );

        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "生成に失敗しました";

        return new Response(JSON.stringify({ ok: true, text }), { headers: { "Content-Type": "application/json" } });

    } catch (e) {
        return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 500 });
    }
}

function generateSaunaPrompt(context, features, freeMessage) {
    // Feature mapping to specific phrases
    const featureMap = {
        "セルフロウリュ": "自分の好きなタイミングでロウリュができて、アロマの香りも最高でした。",
        "水風呂": "水風呂もしっかり冷たくて、サウナ後のクールダウンに最適でした。",
        "インフィニティチェア": "インフィニティチェアがあって、最高にととのうことができました。",
        "ReFaドライヤー": "ReFaのドライヤーやシャワーヘッドが完備されていて、女性には嬉しいポイントでした。",
        "Bluetooth音楽": "Bluetoothでスマホを繋いで、好きな音楽を聴きながら入れたのが良かったです。",
        "完全非対面": "入退店がQRコードでスムーズ、誰とも会わずにプライベート空間を満喫できました。",
        "手ぶら利用": "タオルやアメニティが充実しているので、手ぶらでふらっと行けるのが便利です。",
        "駅近": "富山駅から歩いてすぐなので、アクセスも抜群でした。"
    };

    // Convert selected features to narrative hints
    const featureHints = features.map(f => featureMap[f] || f).join("\n");

    return `
  あなたは富山駅前にある完全個室プライベートサウナ「i3u7 (イマーシブサウナ)」の利用客です。
  Googleマップに投稿する、自然で具体的なクチコミを作成してください。
  
  ## 条件
  - 3〜5文程度、120〜200文字
  - 絵文字を1〜2個ほど適度に使用
  - **「〜しました」「〜でした」などの過去形**で体験を語る
  - 過度な宣伝っぽさを消し、個人の感想として書く
  
  ## 入力情報
  **利用シーン**: ${context}
  
  **特に良かった点（以下の要素を文章に自然に組み込んでください）**:
  ${featureHints}
  
  **自由記述の感想・応援メッセージ**:
  ${freeMessage ? `「${freeMessage}」という内容も必ず含めてください。` : "特になし"}
  
  ## 生成例のトーン
  「初めて利用しましたが、部屋がおしゃれで驚きました。セルフロウリュのアロマの香りに癒やされました。手ぶらで行けるのも良かったです！」
  
  上記の情報を元に、自然なレビューを1つ作成してください。出力は本文のみ。
  `.trim();
}
