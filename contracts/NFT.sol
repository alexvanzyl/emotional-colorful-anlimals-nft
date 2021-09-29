// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

import {Base64} from "./libraries/Base64.sol";

contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenId;

    string private baseSvg =
        "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

    string[] private firstWords = [
        "Afraid",
        "Aggrieved",
        "Agitated",
        "Agreeable",
        "Amazed",
        "Bad",
        "Bereaved",
        "Bewildered",
        "Bored",
        "Brave"
        "Calm",
        "Careful",
        "Certain",
        "Charged",
        "Charming",
        "Dangerous",
        "Defeated",
        "Defiant",
        "Delightful",
        "Depressed",
        "Eager",
        "Elated",
        "Embarrassed",
        "Enchanting",
        "Encouraging"
    ];
    string[] private secondWords = [
        "Red",
        "Blue",
        "Green",
        "Pink",
        "Orange",
        "Yellow",
        "Black",
        "White",
        "Purple",
        "Cyan",
        "Magenta",
        "Brown",
        "Violet",
        "Copper",
        "Grey",
        "Cream",
        "Lime",
        "Beige",
        "Amber",
        "Almond",
        "Aqua",
        "Eggshell",
        "Flame",
        "Flax",
        "Ebony"
    ];
    string[] private thirdWords = [
        "Buffalo",
        "Rabbit",
        "Dog",
        "Baboon",
        "Bat",
        "Fox",
        "Cheetah",
        "Chimpanzee",
        "Monkey",
        "Mongoose",
        "Elephant",
        "Wolf",
        "Zebra",
        "Hedgehog",
        "Lion",
        "Bear",
        "Gorilla",
        "Ostrich",
        "Rhino",
        "Warthog",
        "Giraffe",
        "Hyena",
        "Deer",
        "Muse"
        "Mouse"
    ];

    event NewNFTMinted(address indexed sender, uint256 indexed tokenId);

    constructor() ERC721("AnonymousNFT", "WAA") {
        console.log("This is my NFT contract. Woah!");
    }

    function mint() public payable {
        uint256 newItemId = _tokenId.current();

        string memory first = pickRandomFirstWord(newItemId);
        string memory second = pickRandomSecondWord(newItemId);
        string memory third = pickRandomThirdWord(newItemId);
        string memory combinedWords = string(
            abi.encodePacked(first, second, third)
        );

        string memory svg = string(
            abi.encodePacked(baseSvg, combinedWords, "</text></svg>")
        );

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        combinedWords,
                        '", "description": "A highly acclaimed collection of colorful and emitional animals.", "image": "data:image/svg+xml;base64,',
                        Base64.encode(bytes(svg)),
                        '"}'
                    )
                )
            )
        );

        string memory finalTokenURI = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        console.log("\n--------------------");
        console.log(finalTokenURI);
        console.log("--------------------\n");

        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, finalTokenURI);
        console.log(
            "An NFT w/ ID %s has been minted to %s",
            newItemId,
            msg.sender
        );
        _tokenId.increment();
        emit NewNFTMinted(msg.sender, newItemId);
    }

    function pickRandomFirstWord(uint256 tokenId)
        public
        view
        returns (string memory)
    {
        uint256 rand = random(
            string(abi.encodePacked("FIRST_WORD", Strings.toString(tokenId)))
        );
        rand = rand % firstWords.length;
        return firstWords[rand];
    }

    function pickRandomSecondWord(uint256 tokenId)
        public
        view
        returns (string memory)
    {
        uint256 rand = random(
            string(abi.encodePacked("SECOND_WORD", Strings.toString(tokenId)))
        );
        rand = rand % secondWords.length;
        return secondWords[rand];
    }

    function pickRandomThirdWord(uint256 tokenId)
        public
        view
        returns (string memory)
    {
        uint256 rand = random(
            string(abi.encodePacked("THIRD_WORD", Strings.toString(tokenId)))
        );
        rand = rand % thirdWords.length;
        return thirdWords[rand];
    }

    function random(string memory input) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(input)));
    }
}
