# Ethereum Mainnet デプロイ変更リスト

**作成日:** 2025-11-05
**現在:** Polygon Mainnetでテスト完了
**次:** Ethereum Mainnetに本番デプロイ

---

## 📋 デプロイ前の確認事項

- [ ] Polygonでの全テスト完了
  - [ ] tokenURIが`.json`なしで返ることを確認
  - [ ] メタデータAPIが200 OKを返す
  - [ ] OpenSeaで表示確認
  - [ ] 管理画面からのミント動作確認
- [ ] ウォレット残高確認（Ethereum Mainnetに十分なETH）
- [ ] 画像ファイル準備（最低1.jpgは必須）
- [ ] コントラクトコードの最終確認

---

## 🚀 STEP 1: Ethereum Mainnetにデプロイ

### 実行コマンド

```bash
cd /mnt/c/Contracts_UI_V2/projects/villain-ambassador

# デプロイ実行
npx hardhat run scripts/deploy.js --network mainnet
```

### デプロイ後に記録する情報

```
Contract Address: 0x________________________________
Transaction Hash: 0x________________________________
Etherscan URL: https://etherscan.io/address/0x________________________________
```

**⚠️ この Contract Address を以降の全ての設定で使用します！**

---

## 🔧 STEP 2: Vercel環境変数の更新

**URL:** https://vercel.com/tenchan000517s-projects/villain-nft-api/settings/environment-variables

### 更新する環境変数（Production）

| 環境変数名 | 変更前（Polygon） | 変更後（Mainnet） |
|-----------|------------------|------------------|
| `CHAIN_ID` | `137` | `1` |
| `CONTRACT_ADDRESS` | `0x168CCB189b180d6caBEf70fB8604227e300a092F` | `[本番アドレス]` |
| `NEXT_PUBLIC_CHAIN_ID` | `137` | `1` |
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | `0x168CCB189b180d6caBEf70fB8604227e300a092F` | `[本番アドレス]` |

### 変更不要（そのまま）

| 環境変数名 | 値 |
|-----------|---|
| `IMAGE_BASE_URL` | `https://0xmavillain.com/data/ambassador/img` |
| `EXTERNAL_URL` | `https://0xmavillain.com/` |

### 設定手順

1. Vercel Dashboardにアクセス
2. 各環境変数の「Edit」をクリック
3. 値を変更
4. 「Save」をクリック
5. **全ての変更後、自動的に再デプロイされます**

---

## 📝 STEP 3: ローカル環境変数の更新

**ファイル:** `/mnt/c/villain-nft-api/.env.local`

### 変更内容

```bash
# 変更前
CHAIN_ID=137
CONTRACT_ADDRESS=0x168CCB189b180d6caBEf70fB8604227e300a092F
NEXT_PUBLIC_CONTRACT_ADDRESS=0x168CCB189b180d6caBEf70fB8604227e300a092F
NEXT_PUBLIC_CHAIN_ID=137

# 変更後
CHAIN_ID=1
CONTRACT_ADDRESS=[本番アドレス]
NEXT_PUBLIC_CONTRACT_ADDRESS=[本番アドレス]
NEXT_PUBLIC_CHAIN_ID=1
```

---

## 🎯 STEP 4: Hardhatスクリプトの更新

以下のスクリプトファイル内のコントラクトアドレスを更新：

### 4-1. MINTER_ROLE付与スクリプト

**ファイル:** `scripts/grant-minter-role.js`

```javascript
// 変更前
const contractAddress = "0x5787C5bbAA2b7037539c22C9e008fC55B456D90A";

// 変更後
const contractAddress = "[本番アドレス]"; // Ethereum Mainnet
```

**実行:** デプロイ直後に実行
```bash
npx hardhat run scripts/grant-minter-role.js --network mainnet
```

---

### 4-2. テストミントスクリプト

**ファイル:** `scripts/test-mint.js`

```javascript
// 変更前
const contractAddress = "0x168CCB189b180d6caBEf70fB8604227e300a092F";

// 変更後
const contractAddress = "[本番アドレス]"; // Ethereum Mainnet
```

**実行:** MINTER_ROLE付与後
```bash
npx hardhat run scripts/test-mint.js --network mainnet
```

---

### 4-3. tokenURI確認スクリプト

**ファイル:** `scripts/check-token-uri.js`

```javascript
// 変更前
const contractAddress = "0x168CCB189b180d6caBEf70fB8604227e300a092F";

// 変更後
const contractAddress = "[本番アドレス]"; // Ethereum Mainnet
```

**実行:** テストミント後
```bash
npx hardhat run scripts/check-token-uri.js --network mainnet
```

---

### 4-4. baseExtension確認スクリプト

**ファイル:** `scripts/check-base-extension.js`

```javascript
// 変更前
const contractAddress = "0x168CCB189b180d6caBEf70fB8604227e300a092F";

// 変更後
const contractAddress = "[本番アドレス]"; // Ethereum Mainnet
```

**実行:** デプロイ直後
```bash
npx hardhat run scripts/check-base-extension.js --network mainnet
```

---

## ✅ STEP 5: デプロイ後の確認作業

### 5-1. baseExtension確認

```bash
npx hardhat run scripts/check-base-extension.js --network mainnet
```

**期待値:** `baseExtension: ""`（空文字列）

---

### 5-2. MINTER_ROLE付与

```bash
npx hardhat run scripts/grant-minter-role.js --network mainnet
```

**期待値:** `✅ MINTER_ROLE granted! Has MINTER_ROLE: true`

---

### 5-3. テストミント

```bash
npx hardhat run scripts/test-mint.js --network mainnet
```

**期待値:**
```
✅ ミント成功!
トークンID: 1
トランザクション: 0x...
```

---

### 5-4. tokenURI確認

```bash
npx hardhat run scripts/check-token-uri.js --network mainnet
```

**期待値:**
```
Token #1:
  URI: https://villain-nft-api.vercel.app/api/metadata/1

✅ tokenURI is correct!
```

**❌NG例:** `https://villain-nft-api.vercel.app/api/metadata/1.json` (`.json`付き)

---

### 5-5. メタデータAPI確認

```bash
curl "https://villain-nft-api.vercel.app/api/metadata/1"
```

**期待値:** HTTP 200 + 正しいJSON
```json
{
  "name": "AMBASSADOR PASS #1",
  "description": "Join the \"着て稼ぐ\" movement...",
  "image": "https://0xmavillain.com/data/ambassador/img/1.jpg",
  "external_url": "https://0xmavillain.com/",
  "attributes": [
    {"trait_type": "【rarity】", "value": "Common"},
    {"trait_type": "【code】", "value": "TEST1"}
  ]
}
```

---

### 5-6. 管理画面確認

1. https://villain-nft-api.vercel.app/admin にアクセス
2. **Network表示を確認**
   - 期待値: `Ethereum (1)`
   - NG: `Polygon (137)` や `Arbitrum One (42161)`
3. **Contract Address表示を確認**
   - 期待値: 本番デプロイしたアドレス
4. MetaMask接続（Ethereum Mainnet）
5. テストミント実行
6. 成功時のリンク確認
   - 期待値: `Etherscanで確認 →`
   - NG: `Polygonscanで確認` や `Arbiscanで確認`

---

### 5-7. OpenSea確認（10-20分後）

```
https://opensea.io/assets/ethereum/[本番アドレス]/1
```

1. NFTが表示されるか確認
2. 「Refresh metadata」をクリック
3. 画像が表示されるか確認
4. Propertiesを確認
   - 【rarity】: Common
   - 【code】: TEST1（またはテストミント時のコード）

---

## 🔄 STEP 6: ログファイルの更新

デプロイ後、以下のログファイルが自動更新されます：

```
scripts/logs/network_logs_mainnet.txt
scripts/logs/chronological_logs.txt
```

内容を確認して、本番アドレスが記録されていることを確認してください。

---

## 📊 デプロイ完了後の状態

### 本番環境（Ethereum Mainnet）

```
Network: Ethereum Mainnet (Chain ID: 1)
Contract: [本番アドレス]
Etherscan: https://etherscan.io/address/[本番アドレス]
OpenSea: https://opensea.io/assets/ethereum/[本番アドレス]/1
管理画面: https://villain-nft-api.vercel.app/admin
メタデータAPI: https://villain-nft-api.vercel.app/api/metadata/
```

### テスト環境（Polygon Mainnet）- 参考用

```
Network: Polygon Mainnet (Chain ID: 137)
Contract: 0x168CCB189b180d6caBEf70fB8604227e300a092F
Polygonscan: https://polygonscan.com/address/0x168CCB189b180d6caBEf70fB8604227e300a092F
OpenSea: https://opensea.io/assets/matic/0x168CCB189b180d6caBEf70fB8604227e300a092F/1
```

---

## ⚠️ 重要な注意事項

### 1. baseExtension確認は必須！

デプロイ直後に必ず確認してください。`.json`が付いていると、OpenSeaでメタデータが表示されません。

### 2. Vercel環境変数の更新タイミング

MINTER_ROLE付与やテストミントを行う**前**にVercel環境変数を更新してください。でないと、メタデータAPIが正しく動作しません。

### 3. 画像ファイルの準備

最初は`1.jpg`（Common）だけで問題ありません。他のレアリティの画像は、該当するNFTをミントする前にアップロードすればOKです。

### 4. OpenSeaの表示まで時間がかかる

OpenSeaがメタデータをキャッシュするまで10-20分かかる場合があります。「Refresh metadata」を実行して待ちましょう。

### 5. ガス代の確認

Ethereum Mainnetはガス代が高いです。デプロイ前に以下を確認：
- ウォレット残高（0.05 ETH以上推奨）
- ガス価格（https://etherscan.io/gastracker）
- 混雑時を避ける

---

## 🎉 デプロイ完了チェックリスト

全て✅になったら本番稼働OK：

- [ ] Ethereum Mainnetにデプロイ完了
- [ ] Etherscanで検証済み
- [ ] baseExtension = "" 確認
- [ ] MINTER_ROLE付与完了
- [ ] Vercel環境変数を更新（CHAIN_ID=1, CONTRACT_ADDRESS=[本番]）
- [ ] Vercel自動再デプロイ完了
- [ ] ローカル.env.local更新
- [ ] 全てのスクリプトのアドレス更新
- [ ] テストミント成功
- [ ] tokenURIが正しいURL（.jsonなし）
- [ ] メタデータAPIが200 OK
- [ ] 管理画面でネットワーク表示が"Ethereum (1)"
- [ ] 管理画面のコントラクトアドレスが本番アドレス
- [ ] ミント成功時のリンクが"Etherscanで確認"
- [ ] OpenSeaで表示確認（10-20分後）
- [ ] 画像が正しく表示される
- [ ] Propertiesが正しく表示される（【rarity】【code】）

---

## 📚 参考ドキュメント

- **全体の引き継ぎ:** `HANDOFF.md`
- **メタデータ問題:** `OPENSEA_METADATA_ISSUE.md`
- **コントラクト検証:** `CONTRACT_VERIFICATION.md`
- **本番デプロイ手順:** `NEXT_STEPS_MAINNET_DEPLOY.md`

---

**作成者:** Claude Code
**最終更新:** 2025-11-05
**次の担当者へ:** このチェックリストに従って、確実にデプロイを進めてください！
