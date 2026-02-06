# Google Map Review Assistant - デプロイ手順書

GitHubとCloudflare Pagesを使って、このシステムをインターネット公開する手順です。
セキュリティのため、**GoogleマップのURL** や **APIキー** はコードに直接書かず、Cloudflareの設定画面で入力する方式にしています。

---

## 📅 ステップ1: GitHubへのアップロード

まず、作成したコードをGitHubに保存します。

1.  **GitHubで新しいリポジトリを作成**
    *   GitHubにログインし、「New repository」をクリック。
    *   リポジトリ名（例: `i3u7-review-app`）を入力し、「Private」（非公開）推奨で作成します。

2.  **フォルダをアップロード**
    *   作成した `GoogleMapReviewApp` フォルダの中身を、GitコマンドまたはGitHub Desktop等でプッシュします。

---

## ☁️ ステップ2: Cloudflare Pagesでのデプロイ設定

1.  **Cloudflareにログイン**
    *   Cloudflareダッシュボードを開き、左メニューの「Kworkers & Pages」→「Overview」へ。
    *   「Create Application」→「Pages」→「Connect to Git」を選択。

2.  **リポジトリの選択**
    *   先ほど作成した `i3u7-review-app` リポジトリを選択し、「Begin setup」をクリック。

3.  **ビルド設定（超重要）**
    以下の通り設定してください。
    *   **Project name**: 任意の名前（URLになります 例: `i3u7-review` → `i3u7-review.pages.dev`）
    *   **Framework preset**: `None / One-click` (選択なしでOK)
    *   **Build command**: 空欄のままでOK
    *   **Build output directory**: `public`
        *   ⚠️ ここを必ず `public` にしてください！

---

## 🔑 ステップ3: 環境変数の設定 (URLとAPIキー)

ここで「GoogleマップのURL」と「GeminiのAPIキー」を設定します。
これにより、コードを書き換えずにURLなどを変更できるようになります。

1.  Cloudflareのデプロイ設定画面のまま、「Environment variables (advanced)」を展開します。
2.  以下の2つの変数を追加してください。

| 変数名 (Variable name) | 値 (Value) | 説明 |
| :--- | :--- | :--- |
| **`GEMINI_API_KEY`** | `AIzaSy...` (取得したキー) | GeminiのAPIキー |
| **`GMAP_REVIEW_URL`** | `https://maps.app.goo.gl/...` | クチコミ投稿用のGoogleマップURL |

3.  入力し終わったら、「Save and Deploy」をクリックします。

---

## ✅ ステップ4: 動作確認

デプロイが完了すると、`https://xxxx.pages.dev` というURLが発行されます。

1.  発行されたURLにアクセスします。
2.  「自分で書く」ボタンがクリックできるようになっているか確認します（設定が正しければリンクが有効化されます）。
3.  「AIアシスタント」で適当な項目を選び、文章が生成されるか確認します。
4.  「コピーしてGoogleマップへ」を押し、設定したマップURLに飛ぶか確認します。

---

## 💡 設定を変更したいときは？

GoogleマップのURLが変わったり、APIキーを変えたい場合は、
**Cloudflareのダッシュボード** > **Settings** > **Environment variables**
から値を変更するだけでOKです。コードを修正してデプロイし直す必要はありません。
