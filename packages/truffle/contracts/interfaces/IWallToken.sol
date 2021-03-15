
pragma solidity >=0.7.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IWallToken is IERC721 {
    function getTotalPieces() external view returns (uint256);

    function mintPiece(
        string memory _name,
        string memory _uri,
        uint _royalties,
        uint _salePrice,
        bool _ONSALE,
        bool _ACCEPTBIDS
    ) external returns(uint256);

    function getPiece(uint256 _id)
        external
        view
        returns (
            uint id,
            string memory name,
            address artist,
            string memory uri,
            address currentOwner,
            uint royalties,
            uint salePrice,
            bool onSale,
            bool acceptsBids
        );
    function buyToken (address buyer, uint _id) external;
    function setNewSalePrice (uint _id, uint newSalePrice) external;
    function setOnSale (uint _id, uint salePrice) external;
    function getLastBidOnPiece(uint _id) external view returns (uint bidAmount, address bidder);
    function placeBid(uint _id, address _bidder, uint _bidAmount) external;
    function acceptLastBid(uint _id) external;
}
