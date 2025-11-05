import { ethers } from 'ethers';

// レアリティ名のマッピング
const RARITY_NAMES = [
  "Common",
  "Uncommon",
  "Rare",
  "Epic",
  "Legendary",
  "Mythic",
  "Galaxy",
  "Origin"
];

// コントラクトABI（必要な関数のみ）
const ABI = [
  "function tokenRarity(uint256) view returns (uint8)",
  "function tokenCode(uint256) view returns (string)",
  "function ownerOf(uint256) view returns (address)"
];

/**
 * メタデータAPI - OpenSea Metadata Standard準拠
 */
export default async function handler(req, res) {
  const { tokenId } = req.query;

  // バリデーション
  if (!tokenId || isNaN(tokenId) || Number(tokenId) < 1) {
    return res.status(400).json({
      error: 'Invalid tokenId',
      message: 'tokenId must be a positive number'
    });
  }

  try {
    // 環境変数チェック
    if (!process.env.RPC_URL || !process.env.CONTRACT_ADDRESS) {
      throw new Error('Missing required environment variables: RPC_URL or CONTRACT_ADDRESS');
    }

    // Ethereum RPCに接続
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      ABI,
      provider
    );

    // コントラクトからデータ取得（並列実行）
    const [rarity, code, owner] = await Promise.all([
      contract.tokenRarity(tokenId),
      contract.tokenCode(tokenId),
      contract.ownerOf(tokenId) // 存在確認も兼ねる
    ]);

    // レアリティを数値からテキストに変換
    const rarityNumber = Number(rarity);
    const rarityName = RARITY_NAMES[rarityNumber];
    const rarityFileName = rarityName.toLowerCase();

    // メタデータ生成
    const metadata = {
      name: `Villain Ambassador #${tokenId}`,
      description: "Villainアパレル購入総額10万円達成者に贈られるアンバサダーNFT。購入者固有のvillainpassコードが紐付けられています。",
      image: `${process.env.IMAGE_BASE_URL}/${rarityFileName}.png`,
      external_url: process.env.EXTERNAL_URL || "https://villain-brand.com",
      attributes: [
        {
          trait_type: "Rarity",
          value: rarityName
        },
        {
          trait_type: "Code",
          value: code
        }
      ]
    };

    // CORSヘッダー設定（OpenSea対応）
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

    // キャッシュ設定（1時間）
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');

    return res.status(200).json(metadata);

  } catch (error) {
    console.error('Metadata fetch error:', error);

    // エラーの種類によって適切なレスポンス
    if (error.message && error.message.includes('ERC721NonexistentToken')) {
      return res.status(404).json({
        error: 'Token does not exist',
        tokenId: Number(tokenId)
      });
    }

    if (error.message && error.message.includes('Missing required environment variables')) {
      return res.status(500).json({
        error: 'Server configuration error',
        message: 'Please configure environment variables'
      });
    }

    return res.status(500).json({
      error: 'Failed to fetch metadata',
      message: error.message
    });
  }
}
