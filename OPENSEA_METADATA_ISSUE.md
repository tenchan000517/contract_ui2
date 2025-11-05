# OpenSeaメタデータ表示問題 - 完全ドキュメント

**作成日:** 2025-10-31
**問題発生日:** 2025-10-31（V2デプロイ時）
**解決日:** 2025-10-31（baseExtension修正）

---

## 📋 問題の概要

**症状:**
OpenSeaでNFTのメタデータ（画像、名前、属性）が表示されない

**影響範囲:**
- V2コントラクト（0x3d162F2e2f3160FfEedd41D0c00e583eA6d8764a）
- V3コントラクト（0x315c0eA0CBE0CdCeae2a3ae4E30eBE7db752D046）

**V1コントラクトでは正常に動作:**
- V1アドレス: 0xfba3BB65D179F9Dcd51a3b2B71D43ABBd0f6F0C6

---

## 🔍 根本原因の分析

### V1とV2/V3のコード差分

#### V1（テンプレート版 - 210行）

```solidity
// Line 112
function tokenURI(uint256 tokenId) public view override returns (string memory) {
    _requireOwned(tokenId);
    return string(abi.encodePacked(_baseTokenURI, tokenId.toString()));
}
```

**結果:**
```
tokenURI(1) → "https://villain-nft-api.vercel.app/api/metadata/1"
```

#### V2/V3（改善版 - 304行）

```solidity
// Line 26: 状態変数の追加
string public baseExtension = ".json";

// Line 125: tokenURI関数
function tokenURI(uint256 tokenId) public view override returns (string memory) {
    _requireOwned(tokenId);
    return string(abi.encodePacked(_baseTokenURI, tokenId.toString(), baseExtension));
    //                                                                 ^^^^^^^^^^^^^ ここが追加された
}
```

**結果（修正前）:**
```
tokenURI(1) → "https://villain-nft-api.vercel.app/api/metadata/1.json"
```

### APIエンドポイントとのミスマッチ

**実際のAPIエンドポイント（Next.js App Router）:**
```
/api/metadata/[tokenId]/route.ts
→ https://villain-nft-api.vercel.app/api/metadata/1
```

**コントラクトが返すURL（修正前）:**
```
https://villain-nft-api.vercel.app/api/metadata/1.json
```

**結果:**
- `.json`付きでアクセス → **400 Bad Request**
- OpenSeaがメタデータを取得できない

---

## 📊 Vercelログによる証拠

### 修正前（2025-10-31 11:35頃）

```
GET /api/metadata/1.json → 400 Bad Request ❌
GET /api/metadata/2.json → 400 Bad Request ❌
GET /api/metadata/3.json → 400 Bad Request ❌
```

### 修正後（2025-10-31 11:40以降）

```
GET /api/metadata/1 → 200 OK ✅
GET /api/metadata/2 → 200 OK ✅
GET /api/metadata/3 → 200 OK ✅
```

---

## ✅ 実施した修正

### 修正方法

**オンチェーンで状態変数を変更:**

```javascript
// スクリプト: scripts/fix-base-extension.js
await contract.setBaseExtension("");
```

**トランザクション:**
```
Hash: 0x3defbcf60322495c5eda44f2ed3a7b5c77f4f42022025ec7c556a25acd7eef25
Network: Arbitrum One
実行日時: 2025-10-31 11:40頃
```

### 修正結果

**修正前:**
```solidity
baseExtension = ".json"
tokenURI(1) → "...api/metadata/1.json"
```

**修正後:**
```solidity
baseExtension = ""
tokenURI(1) → "...api/metadata/1"
```

---

## 🎯 なぜbaseExtensionが追加されたのか？

### 設計意図

baseExtension機能は以下のユースケース向けに設計されている：

**静的ファイルベースのメタデータサーバー:**
```
https://example.com/metadata/
├── 1.json
├── 2.json
├── 3.json
└── ...
```

この場合：
- `baseURI = "https://example.com/metadata/"`
- `baseExtension = ".json"`
- `tokenURI(1) = "https://example.com/metadata/1.json"` ✅

### 今回のプロジェクトの場合

**Next.js App Routerのダイナミックルート:**
```
/api/metadata/[tokenId]/route.ts
```

この場合：
- `baseURI = "https://villain-nft-api.vercel.app/api/metadata/"`
- `baseExtension = ""` ← 空文字列が正解
- `tokenURI(1) = "https://villain-nft-api.vercel.app/api/metadata/1"` ✅

---

## 🔧 再発防止策

### 1. コントラクトデプロイ時のチェックリスト

**デプロイ後、必ず確認:**

```bash
# tokenURIを確認
npx hardhat run scripts/check-token-uri.js --network arbitrum

# baseExtensionを確認
const baseExtension = await contract.baseExtension();
console.log("baseExtension:", baseExtension); // "" であるべき
```

**期待値:**
```
tokenURI(1) → https://villain-nft-api.vercel.app/api/metadata/1
baseExtension → ""
```

### 2. デプロイ前の設定確認

**コンストラクタで初期化（推奨）:**

```solidity
// オプション1: デフォルト値を空にする
string public baseExtension = ""; // ← 最初から空

// オプション2: コンストラクタで明示的に設定
constructor(string memory baseURI) ERC721("Villain Ambassador TEST", "VAMBT") {
    _baseTokenURI = baseURI;
    baseExtension = ""; // ← 明示的に空を設定
    // ...
}
```

### 3. API側の対応（オプション）

**`.json`付きリクエストにも対応する（将来的な選択肢）:**

Next.js middleware や rewrite で対応可能：

```javascript
// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/metadata/:tokenId.json',
        destination: '/api/metadata/:tokenId',
      },
    ]
  },
}
```

ただし、**コントラクト側で正しく設定する方が推奨**。

---

## 📝 重要な教訓

### 1. テンプレートと改善版の差異管理

**問題:**
- テンプレート版（V1）と改善版（V2/V3）でtokenURI()の実装が異なる
- 新機能（baseExtension）の追加が既存動作に影響

**対策:**
- 機能追加時は既存動作との互換性を確認
- デフォルト値が意図しない動作を引き起こさないか検証

### 2. コントラクトの不変性と可変性

**修正できたもの:**
- ✅ baseExtension（状態変数）
- ✅ setBaseExtension()関数が実装されていた

**もし実装されていなかったら:**
- ❌ コントラクト再デプロイが必要
- ❌ 既存のNFT保有者に影響
- ❌ OpenSeaのインデックスやり直し

**結論:**
設計時に変更可能な項目（setters）を実装することの重要性。

### 3. OpenSeaの動作理解

**学んだこと:**
- OpenSeaはtokenURI()を直接使用
- 間違ったURLを返すと400/404エラー
- 500エラーは「サーバー問題」と判断される
- 存在しないトークンには404を返すべき

---

## 🔗 関連ドキュメント・ファイル

**コントラクト:**
- V1テンプレート: `/mnt/c/Contracts_UI_V2/templates/contracts/VillainAmbassadorNFT.sol`
- V3改善版: `/mnt/c/Contracts_UI_V2/projects/villain-ambassador/contracts/VillainAmbassadorNFT.sol`

**スクリプト:**
- 修正スクリプト: `scripts/fix-base-extension.js`
- 確認スクリプト: `scripts/check-token-uri.js`

**API:**
- メタデータエンドポイント: `/mnt/c/villain-nft-api/src/app/api/metadata/[tokenId]/route.ts`

**Vercelログ:**
- プロジェクト: https://vercel.com/tenchan000517s-projects/villain-nft-api
- Function Invocation → GET /api/metadata/[tokenId] で確認可能

---

## 🎯 次世代Claude Codeへの指示

### このドキュメントの使い方

1. **新しいコントラクトデプロイ時:**
   - baseExtensionが空文字列であることを確認
   - tokenURI()が正しいURLを返すことを確認
   - メタデータAPIが200 OKを返すことを確認

2. **OpenSeaメタデータ問題発生時:**
   - このドキュメントの「根本原因の分析」セクションを参照
   - baseExtensionの値を確認
   - 必要に応じて`setBaseExtension("")`を実行

3. **API側の問題切り分け:**
   - Vercelログで実際のリクエストURLを確認
   - 400エラーならURL不一致の可能性
   - 500エラーならエラーハンドリング確認

---

## 📞 トラブルシューティング

### Q1: OpenSeaでメタデータが表示されない

**チェック項目:**

1. **tokenURIを確認:**
   ```bash
   npx hardhat run scripts/check-token-uri.js --network arbitrum
   ```
   → `.json`が付いていないか確認

2. **メタデータAPIを直接確認:**
   ```bash
   curl https://villain-nft-api.vercel.app/api/metadata/1
   ```
   → 200 OKで正しいJSONが返るか確認

3. **baseExtensionを確認:**
   ```javascript
   const ext = await contract.baseExtension();
   console.log(ext); // "" が期待値
   ```

4. **修正が必要な場合:**
   ```bash
   npx hardhat run scripts/fix-base-extension.js --network arbitrum
   ```

5. **OpenSeaでリフレッシュ:**
   - 各NFTページで「Refresh metadata」実行
   - 10-20分待つ

### Q2: Vercelで400エラーが出る

**原因:**
`.json`付きリクエスト

**確認:**
```
Vercelログ → Function Invocation
GET /api/metadata/1.json → 400 ← これが原因
```

**解決:**
baseExtension修正（上記Q1参照）

### Q3: 存在しないトークンで500エラー

**現在の問題:**
Token #4, #10などへのアクセスで500エラー

**正しい動作:**
404 Not Foundを返すべき

**修正場所:**
`/mnt/c/villain-nft-api/src/app/api/metadata/[tokenId]/route.ts`

**詳細:**
別途「エラーハンドリング改善」タスクで対応

---

## ✅ チェックリスト（次世代Claude Code用）

新しいコントラクトデプロイ時に確認すべき項目：

- [ ] コンストラクタのbaseURI末尾が`/`で終わっている
- [ ] baseExtensionが空文字列`""`である
- [ ] tokenURI(1)が正しいURL（`.json`なし）を返す
- [ ] メタデータAPIが200 OKを返す
- [ ] デプロイ後、OpenSeaで「Refresh metadata」実行
- [ ] 10-20分後にOpenSeaで表示確認
- [ ] Vercelログで400エラーがないことを確認
- [ ] 存在しないトークンIDで404が返ることを確認

---

以上で、OpenSeaメタデータ表示問題の完全なドキュメント化完了。
