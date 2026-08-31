// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title QAVerifier — immutable proof of AI-assisted bug resolution on 0G Chain
/// @notice Every bug report, test result, and patch is recorded with full provenance.
contract QAVerifier {
    struct Report {
        address agent;          // who submitted
        bytes32 recordingHash;  // 0G Storage hash of the bug video
        bytes32 patchHash;      // 0G Storage hash of the fix
        uint256 timestamp;
        bool    passed;         // did the patch verify?
        string  summary;        // one-line description
    }

    mapping(bytes32 => Report) public reports;
    bytes32[] public reportIds;

    event BugReported(
        bytes32 indexed id,
        address indexed agent,
        bytes32 recordingHash,
        uint256 timestamp
    );

    event Verified(
        bytes32 indexed id,
        bool passed,
        bytes32 patchHash
    );

    /// @notice Record a new bug report. recordingHash comes from 0G Storage.
    function report(
        bytes32 recordingHash,
        string calldata summary
    ) external returns (bytes32 id) {
        id = keccak256(abi.encodePacked(block.timestamp, msg.sender, recordingHash));
        reports[id] = Report({
            agent: msg.sender,
            recordingHash: recordingHash,
            patchHash: bytes32(0),
            timestamp: block.timestamp,
            passed: false,
            summary: summary
        });
        reportIds.push(id);
        emit BugReported(id, msg.sender, recordingHash, block.timestamp);
    }

    /// @notice Record the verification result after the patch is applied.
    function verify(
        bytes32 id,
        bool passed,
        bytes32 patchHash
    ) external {
        require(reports[id].agent == msg.sender, "only agent");
        reports[id].passed = passed;
        reports[id].patchHash = patchHash;
        emit Verified(id, passed, patchHash);
    }

    /// @notice How many reports exist.
    function count() external view returns (uint256) {
        return reportIds.length;
    }
}
