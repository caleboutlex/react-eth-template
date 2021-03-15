// SPDX-License-Identifier: MIT
pragma solidity 0.7.0;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IWallToken.sol";


contract WallMarket is IERC721Receiver {
  
    address admin; 
    uint DEFAULT_MIN_BID = 1*10^18;
    IWallToken WallToken; 
    IERC20 wFTM; 

    constructor (
        IWallToken _wallToken,
        IERC20 _wftmAddress
    ) {
        WallToken = _wallToken;
        wFTM = _wftmAddress;
    }

    function buyPiece (uint _id) public {
        // get the salePrice and if onSale
        (, , , , , , uint salePrice, bool onSale, bool acceptBids) = WallToken.getPiece(_id);
        require(wFTM.allowance(msg.sender, address(this)) >= salePrice, 'MARKET: Caller must approve wFTM first');
        require(wFTM.balanceOf(msg.sender) >= salePrice, 'MARKET: Caller must have enough wFTM');

        // grab current balance 
        uint balanceBefore = wFTM.balanceOf(address(this)); 

        // transfer the salePrice from caller to MARKET contract
        wFTM.transferFrom(msg.sender, address(this), salePrice);

        // make shure the contract got the salePrice
        require(wFTM.balanceOf(address(this)) >= (balanceBefore + salePrice), 'MARKET: Contract did not recive wFTM saleprice');

        // approve the saleprice to WallToken
        wFTM.approve(address(WallToken), salePrice);

        // now that we have required everything and have transferd the saleprice to MARKET contract we can buy the token 
        WallToken.buyToken(msg.sender, _id);
       
    }

    function acceptBidLastBidOnPiece(uint _id) public {
        require(WallToken.ownerOf(_id) == msg.sender, 'only owner of token can call this');
        require(WallToken.getApproved(_id) == address(this), 'MARKET: Token is not approved to MARKET');

        (uint bidamount, address bidder) = WallToken.getLastBidOnPiece(_id);
        require(wFTM.allowance(bidder, address(this)) >= bidamount ,'MARKET: Bidder has to approve ERC20');
        require(wFTM.balanceOf(bidder) >= bidamount,'MARKET: Bidder doesnt have enough ERC20');

        uint balancebefore = wFTM.balanceOf(address(this));
        wFTM.transferFrom(bidder, address(this), bidamount);
        require(wFTM.balanceOf(address(this)) == (balancebefore + bidamount), 'MARKET: contract didnt recive the correct tokens from bidder');
        
        wFTM.approve(address(WallToken), bidamount);
        WallToken.acceptLastBid(_id);
    }

    function listPieceForSale(
        uint _id,
        uint _salePrice
    ) public {
        require(WallToken.ownerOf(_id) == msg.sender, 'MARKET: only owner of token can call this');
        require(WallToken.getApproved(_id) == address(this), 'MARKET: Token is not approved to MARKET');
        WallToken.setOnSale(_id, _salePrice);
    }

    function changeSalePrice(
        uint _id, 
        uint _newSalePrice
    ) public {
        require(WallToken.ownerOf(_id) == msg.sender, 'only owner of token can call this');
         WallToken.setNewSalePrice(_id, _newSalePrice);
    }

    function placeBid(
        uint _id,
        uint _bidPrice
    ) public {
        (, , , , , , , bool onSale, bool acceptBids) = WallToken.getPiece(_id);
        require(onSale == true, 'MARKET: Token is not on sale');
        require(acceptBids == true, 'MARKET: Token does not accept bids');

        (uint lastbid, address lastBidder) = WallToken.getLastBidOnPiece(_id);
        uint minBidAmount = lastbid + DEFAULT_MIN_BID;

        require(_bidPrice > minBidAmount, 'MARKET: BID MORE THAN THE MIN BID AMOUNT');

        wFTM.approve(address(this), _bidPrice);
        WallToken.placeBid(_id, msg.sender, _bidPrice);
    }


    
    /* ===== CALLBACK FUNCTIONS FOR ERC721  ==== */
    
    function onERC721Received(address, address, uint256, bytes calldata) external override returns (bytes4) {
        // DO STUFF
        return bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"));
    }
}