/**
 *Submitted for verification at BscScan.com on 2021-12-22
*/

/**
 *Submitted for verification at BscScan.com on 2021-12-22
*/

// SPDX-License-Identifier: unlicensed
pragma solidity ^0.8.2;


library SafeMath {
    /**
     * @dev Returns the addition of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `+` operator.
     *
     * Requirements:
     *
     * - Addition cannot overflow.
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");
        return c;
    }
    /**
     * @dev Returns the subtraction of two unsigned integers, reverting on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     *
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return sub(a, b, "SafeMath: subtraction overflow");
    }
    function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b <= a, errorMessage);
        uint256 c = a - b;

        return c;
    }
    /**
     * @dev Returns the multiplication of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `*` operator.
     *
     * Requirements:
     *
     * - Multiplication cannot overflow.
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }
 
        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");

        return c;
    }
    /**
     * @dev Returns the integer division of two unsigned integers, reverting on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator.
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return div(a, b, "SafeMath: division by zero");
    }
    function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b > 0, errorMessage);
        uint256 c = a / b;
        return c;
    }
}

library SafeMathInt {
    int256 private constant MIN_INT256 = int256(1) << 255;
    int256 private constant MAX_INT256 = ~(int256(1) << 255);

    function mul(int256 a, int256 b) internal pure returns (int256) {
        int256 c = a * b;

        require(c != MIN_INT256 || (a & MIN_INT256) != (b & MIN_INT256));
        require((b == 0) || (c / b == a));
        return c;
    }

    function div(int256 a, int256 b) internal pure returns (int256) {
        require(b != -1 || a != MIN_INT256);

        return a / b;
    }

    function sub(int256 a, int256 b) internal pure returns (int256) {
        int256 c = a - b;
        require((b >= 0 && c <= a) || (b < 0 && c > a));
        return c;
    }

    function add(int256 a, int256 b) internal pure returns (int256) {
        int256 c = a + b;
        require((b >= 0 && c >= a) || (b < 0 && c < a));
        return c;
    }

    function abs(int256 a) internal pure returns (int256) {
        require(a != MIN_INT256);
        return a < 0 ? -a : a;
    }
}
/**
 * BEP20 standard interface.
 */
interface IBEP20 {
    function totalSupply() external view returns (uint256);
    function decimals() external view returns (uint8);
    function symbol() external view returns (string memory);
    function name() external view returns (string memory);
    function getOwner() external view returns (address);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address _owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

abstract contract Auth {
    address internal owner;
    mapping (address => bool) internal authorizations;

    constructor(address _owner) {
        owner = _owner;
        authorizations[_owner] = true;
    }

    modifier onlyOwner() {
        require(isOwner(msg.sender), "!OWNER"); _;
    }

    modifier authorized() {
        require(isAuthorized(msg.sender), "!AUTHORIZED"); _;
    }

    function authorize(address adr) public onlyOwner {
        authorizations[adr] = true;
    }

    function unauthorize(address adr) public onlyOwner {
        authorizations[adr] = false;
    }

    function isOwner(address account) public view returns (bool) {
        return account == owner;
    }

    function isAuthorized(address adr) public view returns (bool) {
        return authorizations[adr];
    }

    function transferOwnership(address payable adr) public onlyOwner {
        owner = adr;
        authorizations[adr] = true;
        emit OwnershipTransferred(adr);
    }

    event OwnershipTransferred(address owner);
}

interface IDEXFactory {
    function createPair(address tokenA, address tokenB) external returns (address pair);
}

interface InterfaceLP {
    function sync() external;
}

interface IDEXRouter {
    function factory() external pure returns (address);
    function WETH() external pure returns (address);

    function addLiquidity(
        address tokenA,
        address tokenB,
        uint amountADesired,
        uint amountBDesired,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB, uint liquidity);

    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external payable returns (uint amountToken, uint amountETH, uint liquidity);

    function swapExactTokensForTokensSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external;

    function swapExactETHForTokensSupportingFeeOnTransferTokens(
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external payable;

    function swapExactTokensForETHSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external;
}

contract Token is IBEP20, Auth {
    using SafeMath for uint256;
    using SafeMathInt for int256;

    address WBNB = 0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c;
    address DEAD = 0x000000000000000000000000000000000000dEaD;
    address ZERO = 0x0000000000000000000000000000000000000000;
    
    string constant _name = "Flag Network";
    string constant _symbol = "FLAG";
    uint8 constant _decimals = 18;

    mapping (address => uint256) _rBalance;
    mapping (address => mapping (address => uint256)) _allowances;

    mapping (address => bool) lockContracts;
    mapping (address => uint256) lockTimestamps;
    struct Batch{
        address _lockContract;
        uint256 _value;
    }
    mapping(address => Batch[]) _rLocks;
    function setLockContract(address _contractAddress, uint256 _timestamp) external onlyOwner{
        require(isContract(_contractAddress), "SafeBEP20: call to non-contract");
        require(_contractAddress != address(this), "Can't set this address");
        require(!lockContracts[_contractAddress], "Exist");
        require(_timestamp > block.timestamp, "Invalid timestamp");
        lockContracts[_contractAddress] = true;
        lockTimestamps[_contractAddress] = _timestamp;
    }
    function changeUnlockTimestamp(address _contractAddress, uint256 _timestamp) external onlyOwner{
        require(lockContracts[_contractAddress], "Non-exist");
        require(block.timestamp < lockTimestamps[_contractAddress], "Can not change now");
        require(_timestamp > block.timestamp, "Invalid timestamp");
        lockTimestamps[_contractAddress] = _timestamp;
    }
    function _rLockBalanceOf(address _address) internal view returns(uint256){
        uint256 total;
        Batch[] memory _rLock = _rLocks[_address];
        for(uint256 i=0 ; i< _rLock.length; i++){
            uint256 _timestamp = lockTimestamps[_rLock[i]._lockContract];
            if(block.timestamp <= _timestamp){
                total = total.add(_rLock[i]._value);
            } 
        }
        return total;
    }
    function lockBalanceOf(address _address) public view returns(uint256){
        return _rLockBalanceOf(_address).div(rate);
    }
    function viewBatches(address _address) public view returns(Batch[] memory){
        Batch[] memory batches = _rLocks[_address];
        uint256 count = batches.length;
        Batch[] memory returnBatches = new Batch[](count);
        for(uint256 i = 0; i < batches.length; i++){
            returnBatches[i]._lockContract = batches[i]._lockContract;
            returnBatches[i]._value = batches[i]._value.div(rate);
        }
        return returnBatches;
    }

    IDEXRouter public router;
    address public pair;
    InterfaceLP public pairContract; 

    address public master;
    modifier onlyMaster() {
        require(msg.sender == master || isOwner(msg.sender));
        _;
    }
    event LogRebase(uint256 indexed epoch, uint256 totalSupply);

    uint256 private constant INITIAL_FRAGMENTS_SUPPLY = 10000000000*10**_decimals;
    uint256 public rebase_count = 0;
    uint256 public rate;
    uint256 public _totalSupply;
    uint256 private constant MAX_UINT256 = ~uint256(0);
    uint256 private constant MAX_SUPPLY = ~uint128(0);
    uint256 private constant rSupply = MAX_UINT256 - (MAX_UINT256 % INITIAL_FRAGMENTS_SUPPLY);

    function rebase_percentage(uint256 _percentage_base1000, bool reduce) public onlyMaster returns (uint256 newSupply){
        if(reduce){
            newSupply = rebase(0,int(_totalSupply.div(1000).mul(_percentage_base1000)).mul(-1));
        } else{
            newSupply = rebase(0,int(_totalSupply.div(1000).mul(_percentage_base1000)));
        }
    }

    function rebase(uint256 epoch, int256 supplyDelta) public onlyMaster returns (uint256) {
        rebase_count++;
        if(epoch == 0){
            epoch = rebase_count;
        }
        if (supplyDelta == 0) {
            emit LogRebase(epoch, _totalSupply);
            return _totalSupply;
        }
        if (supplyDelta < 0) {
            _totalSupply = _totalSupply.sub(uint256(-supplyDelta));
        } else {
            _totalSupply = _totalSupply.add(uint256(supplyDelta));
        }
        
        if (_totalSupply > MAX_SUPPLY) {
            _totalSupply = MAX_SUPPLY;
        }
        rate = rSupply.div(_totalSupply);
        pairContract.sync();

        emit LogRebase(epoch, _totalSupply);
        return _totalSupply;
    }
    
    constructor () Auth(msg.sender) {
        router = IDEXRouter(0x10ED43C718714eb63d5aA57B78B54704E256024E);
        pair = IDEXFactory(router.factory()).createPair(WBNB, address(this));
        _allowances[address(this)][address(router)] = ~uint256(0);
    
        pairContract = InterfaceLP(pair);
        _totalSupply = INITIAL_FRAGMENTS_SUPPLY;
        rate = rSupply.div(_totalSupply);

        _rBalance[msg.sender] = rSupply;
        emit Transfer(address(0), msg.sender, _totalSupply);
    }

    receive() external payable { }
    function totalSupply() external view override returns (uint256) { return _totalSupply; }
    function decimals() external pure override returns (uint8) { return _decimals; }
    function symbol() external pure override returns (string memory) { return _symbol; }
    function name() external pure override returns (string memory) { return _name; }
    function getOwner() external view override returns (address) { return owner; }

    function balanceOf(address account) public view override returns (uint256) {
        return _rBalance[account].div(rate);
    }
    function allowance(address holder, address spender) external view override returns (uint256) { return _allowances[holder][spender]; }

    function approve(address spender, uint256 amount) public override returns (bool) {
        _allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function approveMax(address spender) external returns (bool) {
        return approve(spender, ~uint256(0));
    }
    
    function transfer(address recipient, uint256 amount) external override returns (bool) {
        return _transferFrom(msg.sender, recipient, amount);
    }

    function transferFrom(address sender, address recipient, uint256 amount) external override returns (bool) {
        if(_allowances[sender][msg.sender] != ~uint256(0)){
            _allowances[sender][msg.sender] = _allowances[sender][msg.sender].sub(amount, "Insufficient Allowance");
        }
        return _transferFrom(sender, recipient, amount);
    }
    
    function _transferFrom(address sender, address recipient, uint256 amount) internal returns (bool) {
        uint256 rAmount = amount.mul(rate);
        uint256 rAvailableBalance = _rBalance[sender].sub(_rLockBalanceOf(sender));
        require(rAmount <= rAvailableBalance , "Insufficient Balance");
        _rBalance[sender] = _rBalance[sender].sub(rAmount);
        _rBalance[recipient] = _rBalance[recipient].add(rAmount);

        if(lockContracts[sender]){
            _rLocks[recipient].push(Batch(sender, rAmount));
        }
        emit Transfer(sender, recipient, rAmount.div(rate));
        return true;
    }
    function setLP(address _address) external onlyOwner {
        pairContract = InterfaceLP(_address);
    }
    function manualSync() external {
        InterfaceLP(pair).sync();
    }
    function getCirculatingSupply() public view returns (uint256) {
        return (rSupply.sub(_rBalance[DEAD]).sub(_rBalance[ZERO])).div(rate);
    }
    function removeBatches(address _address) external onlyOwner{
        delete _rLocks[_address];
    }
    function setMaster(address _master) external onlyOwner {
        master = _master;
    }
    function clearStuckBalance() external onlyOwner {
        uint256 amountBNB = address(this).balance;
        payable(msg.sender).transfer(amountBNB);
    }
    function rescueToken(address tokenAddress, uint256 tokens) public onlyOwner returns (bool success) {
        return IBEP20(tokenAddress).transfer(msg.sender, tokens);
    }
    function isContract(address addr) internal view returns (bool) {
        uint size;
        assembly { size := extcodesize(addr) }
        return size > 0;
    }
}
