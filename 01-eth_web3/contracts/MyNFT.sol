// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MyNFT
 * @dev 简单的 ERC721 NFT，用于演示铸造和 DApp 交互。
 */
contract MyNFT is ERC721, Ownable {
    uint256 private _tokenIdCounter;

    constructor() ERC721("MyNFT", "MNFT") Ownable(msg.sender) {
        _mint(msg.sender, 1);
        _tokenIdCounter = 2;
    }

    function mint(address to) external onlyOwner returns (uint256 tokenId) {
        tokenId = _tokenIdCounter;
        _tokenIdCounter += 1;
        _safeMint(to, tokenId);
    }
}

