//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract StoryKeeper is Ownable {
	string[] public inspirations;
	mapping(address => uint256) public inspirationIndex;
	mapping(address => bool) public hasSubmitted;
	uint256 public inspirationCount;
	mapping(address => bool) public whitelist;

	event InspirationSubmission(
		address indexed submitter,
		string inspiration,
		string story
	);

	function addWhitelist(address[] memory _users) public onlyOwner {
		for (uint256 i = 0; i < _users.length; i++) {
			whitelist[_users[i]] = true;
		}
	}
	function removeWhitelist(address[] memory _users) public onlyOwner {
		for (uint256 i = 0; i < _users.length; i++) {
			whitelist[_users[i]] = false;
		}
	}

	function submitOrReplaceInspiration(string memory _inspiration) public {
		require(
			whitelist[msg.sender],
			"You are not allowed to submit inspirations"
		);
		uint256 index = inspirationIndex[msg.sender];
		if (hasSubmitted[msg.sender]) {
			inspirations[index] = _inspiration;
			emit InspirationSubmission(msg.sender, _inspiration, getStory());
		} else {
			inspirationCount++;
			inspirations.push(_inspiration);
			inspirationIndex[msg.sender] = inspirations.length - 1;
			hasSubmitted[msg.sender] = true;
			emit InspirationSubmission(msg.sender, _inspiration, getStory());
		}
	}

	function getStory() public view returns (string memory) {
		string memory story = "";
		for (uint256 i = 0; i < inspirations.length; i++) {
			if (i > 0) {
				story = string(abi.encodePacked(story, " ", inspirations[i]));
			} else {
				story = string(abi.encodePacked(story, inspirations[i]));
			}
		}
		return story;
	}
}
