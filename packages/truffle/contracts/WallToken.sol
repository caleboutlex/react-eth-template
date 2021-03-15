// SPDX-License-Identifier: MIT
pragma experimental ABIEncoderV2;
pragma solidity 0.7.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { WallBase, SafeMath } from "./WallBase.sol";

contract WallToken is WallBase, ERC721("WALLART","WALL-ART") { 
    using SafeMath for uint256;
    uint BASE_MARKET_FEE = 1;
    address WALL_MARKET_ADDRESS; 
    IERC20 wFTM; 

    constructor(
        IERC20 _wftmAddress
    ) {
        manager = msg.sender;
        wFTM = _wftmAddress;
    }


    /* ========== PUBLIC VIEW FUNCTION ========== */

    function getTotalPieces() external view returns (uint256) {
        return allPieces.length;
    }

    /* ======= MANAGER FUNCTIONS ===== */

    function setMarketAddress (address newAddress) external onlyManager {
        WALL_MARKET_ADDRESS = newAddress;
    }

    /**
     * @dev Allow contract owner to update URI to look up all alpaca metadata
     */
    function setURI(uint256 tokenId, string memory _newuri) public  {
        Piece storage _piece = allPieces[tokenId];
        address artist = _piece.artist;
        require(msg.sender == artist, 'WALLTOKEN: ONLY ARTIST CAN SET URI');
        _setTokenURI(tokenId, _newuri);
    }
    
    /* ========== VIEW FUNCTIONS ========== */

    function getURI(uint _id) external view returns (string memory _uri) {
        _uri = tokenURI(_id);
    }


    /**
     * Returns all the relevant information about a specific bud.
     * @param _id The ID of the bud of interest.
     */
    function getPiece(uint _id)
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
        )
    {
        Piece storage piece = allPieces[_id];
        id = _id;
        name = piece.name;
        artist = piece.artist;
        currentOwner = ownerOf(id);
        royalties = piece.royalties;
        salePrice = piece.salePrice;
        onSale = piece.onSale;
        uri = tokenURI(_id);
        acceptsBids = piece.acceptBids;
    }

    function getLastBidOnPiece(uint _id) public view returns (uint bidAmount, address bidder) {
        Piece storage piece = allPieces[_id];
        bidAmount = piece.lastBid.bidAmount;
        bidder = piece.lastBid.bidder;
    }

    
    /* ========== EXTERNAL MUTABLE FUNCTIONS ========== */

    function mintPiece(
        string memory _name,
        string memory _uri,
        uint _royalties,
        uint _salePrice,
        bool _ONSALE,
        bool _ACCEPTBIDS
    ) external returns(uint) {
            
            Piece memory _newPiece = Piece({
                name: _name,
                artist: msg.sender,
                royalties: _royalties,
                salePrice: _salePrice,
                onSale: _ONSALE,
                acceptBids: _ACCEPTBIDS,
                lastBid: Bid({ 
                    bidder: 0x0000000000000000000000000000000000000000,
                    bidAmount: 0
                })
            });
        
            allPieces.push(_newPiece);

            uint Id = allPieces.length - 1;
            // mint the token to this address
            _safeMint(msg.sender, Id);
            // set the URI to the one by the minter
            setURI(Id, _uri);
            if (_ONSALE == true) {
                // approve the token to the market contract 
                approve(WALL_MARKET_ADDRESS, Id);  
            }
            
    }

    /* ========== MARKET MUTABLE FUNCTIONS ========== */

    function placeBid(uint _id, address _bidder, uint _bidAmount) public onlyMarket {
        Piece storage piece = allPieces[_id];
        // doublecheck if token is on sale 
        require(piece.onSale == true, 'WALLTOKEN: Token not for sale');
        require(piece.acceptBids == true, 'WALLTOKEN: Token does not accept bids');
        require(piece.lastBid.bidAmount < _bidAmount, 'WALLTOKEN: Bidder must bid more than last bidAmount');
        Bid memory newbid = Bid({
            bidder: _bidder, 
            bidAmount: _bidAmount
        });
        _placeBid(_id, newbid);
    }


    function buyToken (address buyer, uint _id) public onlyMarket {
        // doublecheck if token is approved to msg.sender == MARKET
        Piece storage piece = allPieces[_id];
        require(piece.onSale == true, 'WALLTOKEN: Token not for sale');
        require( getApproved(_id) == msg.sender, 'WALLTOKEN: Token must be approved to MARKET');
        require( wFTM.allowance(msg.sender, address(this)) >= piece.salePrice, 'WALLTOKEN: ERC20 token must be approved first');
        _finalizeSale(_id, buyer, false);
    }

    function acceptLastBid(uint _id) public onlyMarket {
        Piece storage piece = allPieces[_id];
        require( getApproved(_id) == msg.sender, 'WALLTOKEN: Token must be approved to MARKET');
        require( wFTM.allowance(msg.sender, address(this)) >= piece.salePrice, 'WALLTOKEN: ERC20 token must be approved first');
        require( piece.lastBid.bidAmount != 0, 'WALLTOKEN: NO BIDS');
        _finalizeSale(_id, piece.lastBid.bidder, true);
    }

    function setNewSalePrice (uint _id, uint newSalePrice) public onlyMarket {
       setSalePrice(_id, newSalePrice);
    }

    function setOnSale (uint _id, uint salePrice) public onlyMarket {
        Piece storage piece = allPieces[_id];
        setSalePrice(_id, salePrice);
        piece.onSale = true;   
    }


    
    /* ========== INTERNAL FUNCTIONS ========== */

    function setSalePrice (uint _id, uint newSalePrice) internal {
        Piece storage piece = allPieces[_id];
        piece.salePrice = newSalePrice; 
    }

    function _placeBid (uint _id, Bid memory _bid) internal {
        Piece storage piece = allPieces[_id];
        piece.lastBid = _bid;
    }

    function _finalizeSale(uint _id, address _buyer ,bool isBid) internal {
        Piece storage piece = allPieces[_id];
        address owner = ownerOf(_id);
        if (isBid == false) {

             // get the amount we need to send to the artist 
            uint artistAmount = piece.salePrice.div(100).mul(piece.royalties); 
            // get the market fee 
            uint fee = piece.salePrice.div(100).mul(BASE_MARKET_FEE); //fee is 1%
            // get the amount we need to send to the owner
            uint owneramount = piece.salePrice.sub(fee).sub(artistAmount);

            require(artistAmount.add(fee).add(owneramount) == piece.salePrice, 'WALLTOKEN: amounts dont match up to saleprice');

            // transfer to owner - artist / keep the fee in the market contract
            wFTM.transferFrom(msg.sender, owner, owneramount);
            wFTM.transferFrom(msg.sender, piece.artist, artistAmount);

        } else {

             // get the amount we need to send to the artist 
            uint artistAmount = piece.lastBid.bidAmount.div(piece.royalties); 
            // get the market fee 
            uint fee = piece.lastBid.bidAmount.div(100).mul(BASE_MARKET_FEE); //fee is 1%
            // get the amount we need to send to the owner
            uint owneramount = piece.lastBid.bidAmount.sub(fee).sub(artistAmount);

            require(artistAmount.add(fee).add(owneramount) == piece.lastBid.bidAmount, 'WALLTOKEN: amounts dont match up to saleprice');

            // transfer to owner - artist / keep the fee in the market contract
            wFTM.transferFrom(msg.sender, owner, owneramount);
            wFTM.transferFrom(msg.sender, piece.artist, artistAmount);
            
        }
        
        // if all checks are okay transfer token from current owner to buyer
        transferFrom(owner, _buyer, _id);

       
    }


    /* ====== MODIFIERS ====== */
    /*
     *  The manager is the one that controls all the parameters of this contract except the withdrawl function
     *  this is meant to be called by the Buyer only after the period has ended. 
     */
    modifier onlyMarket() {
        require(WALL_MARKET_ADDRESS == msg.sender, "Only Market Contract can call this function");
        _; 
    }



}

