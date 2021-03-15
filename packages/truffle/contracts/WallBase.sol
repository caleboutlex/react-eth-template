// SPDX-License-Identifier: MIT
pragma solidity 0.7.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract WallBase is Ownable {
    using SafeMath for uint256;
    
    /* ===== ERSCROW PARAMETERS ===== */

    /*
     *  address of the manager of the contract
     */
    address public manager; 

    struct Bid {
        address bidder; 
        uint bidAmount;
    }

    /*
     *  internal array that holds all the info of the NFT's
     */
    Piece[] internal allPieces;

    /*
     *  struct that holds all the info of the NFT's
     */
    struct Piece {
        string name;
        address artist;
        uint royalties;
        uint salePrice; 
        bool onSale;
        bool acceptBids; 
        Bid lastBid;
    }
    
    /* ====== MANAGER FUNCTIONS ====== */

    /*
     *  Sets a new Manager 
     */
    function setManager(address newManager) external onlyManager {
        manager = newManager;

    }

    /* ====== MODIFIERS ====== */
    /*
     *  The manager is the one that controls all the parameters of this contract except the withdrawl function
     *  this is meant to be called by the Buyer only after the period has ended. 
     */
    modifier onlyManager() {
        require(manager == msg.sender, "EscrowBuyer: Only the manager can call this function");
        _; 
    }
    
}