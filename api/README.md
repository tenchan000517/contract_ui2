# Villain Ambassador NFT - Metadata API

このディレクトリは、Villain Ambassador NFTのメタデータを提供するNext.js APIルートのテンプレートです。

## セットアップ

### 1. Next.jsプロジェクトの作成

```bash
npx create-next-app@latest villain-nft-api
cd villain-nft-api
npm install ethers
```

### 2. APIルートの配置

`metadata/[tokenId].js` を以下のパスにコピー:

```
villain-nft-api/
└── pages/
    └── api/
        └── metadata/
            └── [tokenId].js
```

### 3. 環境変数の設定

プロジェクトルートに `.env.local` ファイルを作成:

```bash
# Ethereum RPC URL (Alchemy推奨)
RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY

# コントラクトアドレス (デプロイ後に設定)
CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890

# 画像ベースURL
IMAGE_BASE_URL=https://yourdomain.com/images

# ブランドサイトURL
EXTERNAL_URL=https://villain-brand.com
```

### 4. ローカルテスト

```bash
npm run dev
```

以下のURLでテスト:
```
http://localhost:3000/api/metadata/1
```

### 5. Vercelへのデプロイ

```bash
# Vercel CLIインストール
npm i -g vercel

# デプロイ
vercel

# プロダクション
vercel --prod
```

### 6. Vercel環境変数設定

Vercelダッシュボードで以下を設定:

1. プロジェクト → Settings → Environment Variables
2. 環境変数を追加:
   - `RPC_URL`
   - `CONTRACT_ADDRESS`
   - `IMAGE_BASE_URL`
   - `EXTERNAL_URL`

## エンドポイント

### GET /api/metadata/[tokenId]

指定されたトークンIDのメタデータを返します。

**レスポンス例:**

```json
{
  "name": "Villain Ambassador #123",
  "description": "Villainアパレル購入総額10万円達成者に贈られるアンバサダーNFT。購入者固有のvillainpassコードが紐付けられています。",
  "image": "https://yourdomain.com/images/rare.png",
  "external_url": "https://villain-brand.com",
  "attributes": [
    {
      "trait_type": "Rarity",
      "value": "Rare"
    },
    {
      "trait_type": "Code",
      "value": "A3F9K"
    }
  ]
}
```

## 注意事項

- RPC URLには十分なレート制限のあるプロバイダを使用してください（Alchemy推奨）
- 画像は必ずHTTPSでホスティングしてください
- OpenSeaのキャッシュは1時間です

## トラブルシューティング

### OpenSeaに表示されない

1. OpenSeaで「Refresh Metadata」をクリック
2. APIエンドポイントが正しく設定されているか確認
3. コントラクトの `baseURI` が正しいか確認

### 画像が表示されない

1. 画像URLに直接アクセスして確認
2. CORS設定を確認
3. HTTPS接続を確認
