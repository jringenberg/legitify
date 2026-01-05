// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title BeliefStake
 * @notice Holds USDC stakes for belief attestations. Fixed $2 stake amount per belief.
 */
contract BeliefStake is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    /// @notice Fixed stake amount: $2 USDC (2 * 10^6, since USDC has 6 decimals)
    uint256 public constant STAKE_AMOUNT = 2_000_000; // $2 USDC

    /// @notice USDC token contract
    IERC20 public immutable usdc;

    /// @notice Stake information for each user's stake on an attestation
    struct StakeInfo {
        uint256 amount;
        uint256 timestamp;
    }

    /// @notice Maps attestation UID => staker address => stake info
    mapping(bytes32 => mapping(address => StakeInfo)) public stakes;

    /// @notice Maps attestation UID => total staked amount
    mapping(bytes32 => uint256) public totalStaked;

    /// @notice Maps attestation UID => number of stakers
    mapping(bytes32 => uint256) public stakerCount;

    /// @notice Event emitted when a user stakes on a belief
    event Staked(bytes32 indexed attestationUID, address indexed staker, uint256 amount, uint256 timestamp);

    /// @notice Event emitted when a user unstakes from a belief
    event Unstaked(bytes32 indexed attestationUID, address indexed staker, uint256 amount);

    /**
     * @param _usdc Address of the USDC token contract
     */
    constructor(address _usdc) Ownable(msg.sender) {
        require(_usdc != address(0), "BeliefStake: invalid USDC address");
        usdc = IERC20(_usdc);
    }

    /**
     * @notice Stake $2 USDC on a belief attestation
     * @param attestationUID The EAS attestation UID for the belief
     */
    function stake(bytes32 attestationUID) external nonReentrant {
        require(attestationUID != bytes32(0), "BeliefStake: invalid attestation UID");
        require(stakes[attestationUID][msg.sender].amount == 0, "BeliefStake: already staked");

        // Transfer USDC from user to contract
        usdc.safeTransferFrom(msg.sender, address(this), STAKE_AMOUNT);

        // Record the stake
        stakes[attestationUID][msg.sender] = StakeInfo({
            amount: STAKE_AMOUNT,
            timestamp: block.timestamp
        });

        // Update totals
        totalStaked[attestationUID] += STAKE_AMOUNT;
        stakerCount[attestationUID]++;

        emit Staked(attestationUID, msg.sender, STAKE_AMOUNT, block.timestamp);
    }

    /**
     * @notice Unstake $2 USDC from a belief attestation
     * @param attestationUID The EAS attestation UID for the belief
     */
    function unstake(bytes32 attestationUID) external nonReentrant {
        StakeInfo storage stakeInfo = stakes[attestationUID][msg.sender];
        require(stakeInfo.amount > 0, "BeliefStake: no stake found");

        uint256 amount = stakeInfo.amount;
        
        // Clear the stake
        delete stakes[attestationUID][msg.sender];

        // Update totals
        totalStaked[attestationUID] -= amount;
        stakerCount[attestationUID]--;

        // Return USDC to user
        usdc.safeTransfer(msg.sender, amount);

        emit Unstaked(attestationUID, msg.sender, amount);
    }

    /**
     * @notice Get stake information for a user on an attestation
     * @param attestationUID The EAS attestation UID
     * @param staker The staker address
     * @return amount The staked amount
     * @return timestamp The timestamp when the stake was made
     */
    function getStake(bytes32 attestationUID, address staker) external view returns (uint256 amount, uint256 timestamp) {
        StakeInfo memory stakeInfo = stakes[attestationUID][staker];
        return (stakeInfo.amount, stakeInfo.timestamp);
    }

    /**
     * @notice Get the number of stakers for an attestation
     * @param attestationUID The EAS attestation UID
     * @return count The number of stakers
     */
    function getStakerCount(bytes32 attestationUID) external view returns (uint256 count) {
        return stakerCount[attestationUID];
    }
}

