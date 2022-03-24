// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import './stake.sol';

/**
 * @title factory
 * @author vlad
 * @notice Implements the master staketoken contract to keep track of all tokens being added
 * to be staked and staking.
 */
contract factory {
  // this a particular address for the token that someone has put up
  // to be staked and a list of contract addresses for the staking token
  // contracts paying out stakers for the given token.
  address public farmingContract;
  uint256 public totalStakingContracts;

  /**
   * @notice The constructor for the staking master contract.
   */
  constructor()
  {
      totalStakingContracts = 0;
  }

  function getFarmingContract() external view returns (address) {
    return farmingContract;
  }

  function getTotalStakingContracts() external view returns ( uint256 ) {
    return totalStakingContracts;
  }

  function createNewTokenContract(
    address _rewardsTokenAddy,
    address _stakedTokenAddy,
    uint256 _supply,
    uint256[4] memory _alloc,
    uint256 _timelockSeconds
  ) external {
    require(totalStakingContracts == 0, "already exist pool");
    // create new StakeToken contract which will serve as the core place for
    // users to stake their tokens and earn rewards
    ERC20 _rewToken = ERC20(_rewardsTokenAddy);

    // Send the new contract all the tokens from the sending user to be staked and harvested
    _rewToken.transferFrom(msg.sender, address(this), _supply);

    // in order to handle tokens that take tax, are burned, etc. when transferring, need to get
    // the user's balance after transferring in order to send the remainder of the tokens
    // instead of the full original supply. Similar to slippage on a DEX
    uint256 _updatedSupply = _supply <= _rewToken.balanceOf(address(this))
      ? _supply
      : _rewToken.balanceOf(address(this));

    StakeToken _contract = new StakeToken(
      _updatedSupply,
      _rewardsTokenAddy,
      _stakedTokenAddy,
      msg.sender,
      _alloc,
      _timelockSeconds
    );
    farmingContract = address(_contract);
    totalStakingContracts++;

    _rewToken.transfer(address(_contract), _updatedSupply);

    // do one more double check on balance of rewards token
    // in the staking contract and update if need be
    uint256 _finalSupply = _updatedSupply <=
      _rewToken.balanceOf(address(_contract))
      ? _updatedSupply
      : _rewToken.balanceOf(address(_contract));
    if (_updatedSupply != _finalSupply) {
      _contract.updateSupply(_finalSupply);
    }
  }

  function removeTokenContract(address _faasTokenAddy) external {
    StakeToken _contract = StakeToken(_faasTokenAddy);
    require(
      msg.sender == _contract.tokenOwner(),
      'user must be the original token owner to remove tokens'
    );

    _contract.removeStakeableTokens();
    totalStakingContracts--;
  }
}