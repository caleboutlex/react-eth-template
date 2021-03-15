const MockERC20 = artifacts.require("MockERC20");
const WallToken = artifacts.require("WallToken");
const WallMarket = artifacts.require("WallMarket");

module.exports = async function (deployer) {

  const devAddress = "0x102921eF10283cF79D2aA2B4E2df7e590eBf63F7" ;
  const buyerAddress = "0x866be234ec760Ce372fBfE8B6b2C9Bb5A6F21Db4";

   /* mock TOKEN DEPLOYMENT */ 
   await deployer.deploy(
      MockERC20,
      'forthelols',
      'FTL',
      '4200000000000000000000000000'
    );
  const mocktoken = await MockERC20.deployed()

  /* mint some to myself */ 
  await mocktoken.mintMockCoin("1000000000000000000000");
  await mocktoken.transfer(buyerAddress, "100000000000000000000")

  /* WALL NFT TOKEN DEPLOYMENT */ 
  await deployer.deploy(
    WallToken,
    mocktoken.address
  );
  const walltoken = await WallToken.deployed()
  
  /* MARKET CONTRACT DEPLOYMENT */ 
  await deployer.deploy(
    WallMarket,
    walltoken.address,
    mocktoken.address
  );
  const market = await WallMarket.deployed();

  await walltoken.setMarketAddress(market.address);

};
