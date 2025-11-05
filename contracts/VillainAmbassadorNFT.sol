// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract VillainAmbassadorNFT is ERC721, AccessControl, ERC2981, Pausable {
    using Strings for uint256;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    uint256 private _nextTokenId = 0;
    string private _baseTokenURI;
    string public baseExtension = "";
    uint256 public maxSupply;
    address public withdrawAddress;
    bool public isSBT = false;

    mapping(uint256 => uint8) public tokenRarity;
    mapping(uint256 => string) public tokenCode;

    event NFTMinted(
        uint256 indexed tokenId,
        address indexed to,
        uint8 rarity,
        string code
    );

    event BaseURIUpdated(string newBaseURI);

    event RarityUpdated(
        uint256 indexed tokenId,
        uint8 oldRarity,
        uint8 newRarity
    );

    event CodeUpdated(
        uint256 indexed tokenId,
        string oldCode,
        string newCode
    );

    event MaxSupplySet(uint256 maxSupply);

    event BaseExtensionUpdated(string newBaseExtension);

    event WithdrawAddressUpdated(address newWithdrawAddress);

    event SBTStatusUpdated(bool isSBT);

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor(string memory baseURI)
        ERC721("AMBASSADOR PASS", "AMBPASS")
    {
        _baseTokenURI = baseURI;
        withdrawAddress = msg.sender;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function mint(
        address to,
        uint8 rarity,
        string memory code
    ) external onlyRole(MINTER_ROLE) whenNotPaused returns (uint256) {
        require(rarity < 8, "Invalid rarity: must be 0-7");
        require(bytes(code).length > 0, "Code cannot be empty");

        if (maxSupply > 0) {
            require(_nextTokenId <= maxSupply, "Max supply reached");
        }

        uint256 tokenId = _nextTokenId++;

        _mint(to, tokenId);

        tokenRarity[tokenId] = rarity;
        tokenCode[tokenId] = code;

        emit NFTMinted(tokenId, to, rarity, code);

        return tokenId;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        _requireOwned(tokenId);
        return string(abi.encodePacked(_baseTokenURI, tokenId.toString(), baseExtension));
    }

    function setBaseURI(string memory baseURI) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _baseTokenURI = baseURI;
        emit BaseURIUpdated(baseURI);
    }

    function setTokenRarity(uint256 tokenId, uint8 newRarity) external onlyRole(MINTER_ROLE) {
        _requireOwned(tokenId);
        require(newRarity < 8, "Invalid rarity: must be 0-7");

        uint8 oldRarity = tokenRarity[tokenId];
        tokenRarity[tokenId] = newRarity;

        emit RarityUpdated(tokenId, oldRarity, newRarity);
    }

    function setTokenCode(uint256 tokenId, string memory newCode) external onlyRole(MINTER_ROLE) {
        _requireOwned(tokenId);
        require(bytes(newCode).length > 0, "Code cannot be empty");

        string memory oldCode = tokenCode[tokenId];
        tokenCode[tokenId] = newCode;

        emit CodeUpdated(tokenId, oldCode, newCode);
    }

    function setMaxSupply(uint256 newMaxSupply) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (newMaxSupply > 0) {
            require(newMaxSupply >= _nextTokenId - 1, "Cannot set below current supply");
        }

        maxSupply = newMaxSupply;
        emit MaxSupplySet(newMaxSupply);
    }

    function totalSupply() public view returns (uint256) {
        return _nextTokenId - 1;
    }

    function getRarityName(uint8 rarity) public pure returns (string memory) {
        require(rarity < 8, "Invalid rarity");

        string[8] memory names = [
            "Common",
            "Uncommon",
            "Rare",
            "Epic",
            "Legendary",
            "Mythic",
            "Galaxy",
            "Origin"
        ];

        return names[rarity];
    }

    function setBaseExtension(string memory newBaseExtension) external onlyRole(DEFAULT_ADMIN_ROLE) {
        baseExtension = newBaseExtension;
        emit BaseExtensionUpdated(newBaseExtension);
    }

    function setWithdrawAddress(address newWithdrawAddress) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newWithdrawAddress != address(0), "Invalid address");
        withdrawAddress = newWithdrawAddress;
        emit WithdrawAddressUpdated(newWithdrawAddress);
    }

    function withdraw() external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(withdrawAddress != address(0), "Withdraw address not set");
        (bool success, ) = payable(withdrawAddress).call{value: address(this).balance}("");
        require(success, "Withdraw failed");
    }

    function setDefaultRoyalty(address receiver, uint96 feeNumerator) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _setDefaultRoyalty(receiver, feeNumerator);
    }

    function setPause(bool state) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (state) {
            _pause();
        } else {
            _unpause();
        }
    }

    function setIsSBT(bool state) external onlyRole(DEFAULT_ADMIN_ROLE) {
        isSBT = state;
        emit SBTStatusUpdated(state);
    }

    function transferOwnership(address newOwner) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newOwner != address(0), "New owner is zero address");
        require(newOwner != msg.sender, "Already the owner");

        address previousOwner = msg.sender;

        _grantRole(DEFAULT_ADMIN_ROLE, newOwner);
        _revokeRole(DEFAULT_ADMIN_ROLE, previousOwner);

        emit OwnershipTransferred(previousOwner, newOwner);
    }

    function _update(address to, uint256 tokenId, address auth)
        internal
        override
        whenNotPaused
        returns (address)
    {
        address from = _ownerOf(tokenId);

        if (isSBT) {
            require(
                from == address(0) || to == address(0),
                "SBT: Transfer is not allowed"
            );
        }

        return super._update(to, tokenId, auth);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
