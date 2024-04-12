//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";

contract StoryInspiration {
	string[] public inspirations;
	mapping(address => uint256) public inspirationIndex;
	mapping(address => bool) public hasSubmitted;

	event InspirationSubmission(address indexed submitter, string inspiration);
	event InspirationReplacement(
		address indexed submitter,
		string oldInspiration,
		string newInspiration
	);

	function submitOrReplaceInspiration(string memory _inspiration) public {
		uint256 index = inspirationIndex[msg.sender];
		if (hasSubmitted[msg.sender]) {
			console.log(
				"Replacing inspiration '%s' from %s",
				inspirations[index],
				msg.sender
			);
			inspirations[index] = _inspiration;
			emit InspirationReplacement(
				msg.sender,
				inspirations[index],
				_inspiration
			);
		} else {
			console.log(
				"Submitting new inspiration '%s' from %s",
				_inspiration,
				msg.sender
			);
			inspirations.push(_inspiration);
			inspirationIndex[msg.sender] = inspirations.length - 1;
			hasSubmitted[msg.sender] = true;
			emit InspirationSubmission(msg.sender, _inspiration);
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
