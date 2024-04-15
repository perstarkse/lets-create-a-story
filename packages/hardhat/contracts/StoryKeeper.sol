//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract StoryKeeper {
	string[] public inspirations;
	mapping(address => uint256) public inspirationIndex;
	mapping(address => bool) public hasSubmitted;
	uint256 public inspirationCount;

	event InspirationSubmission(
		address indexed submitter,
		string inspiration,
		string story
	);

	function submitOrReplaceInspiration(string memory _inspiration) public {
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
