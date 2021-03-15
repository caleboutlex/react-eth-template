import erc20Abi from "./abis/erc20.json";
import ownableAbi from "./abis/ownable.json";
import wallbaseabi from "./abis/WallBase.json"
import walltokenabi from "./abis/WallToken.json"
import wallmarketabi from "./abis/WallMarket.json"

const abis = {
  erc20: erc20Abi,
  wallbase: wallbaseabi.abi,
  walltoken: walltokenabi.abi,
  wallmarket: wallmarketabi.abi
};

export default abis;
