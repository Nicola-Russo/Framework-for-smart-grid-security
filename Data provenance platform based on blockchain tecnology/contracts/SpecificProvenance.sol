pragma solidity ^0.5.0;

import "./GenericProvenance.sol";
import "./Provenance.sol";

contract SpecificProvenance is Provenance, GenericProvenance("ProvenanceToken","PROV"){

    function createProvenance(uint _tokenId, string memory _context) public returns (uint index)
    {
        return _createProvenance(_tokenId, _context);
    }

    function updateProvenance(uint _provId, uint _tokenId,string memory _context) public returns (bool success)
    {
        return _updateProvenance(_provId, _tokenId, _context);
    }

    function deleteProvenance(uint _provId)public returns (bool success)
    {
        return _deleteProvenance(_provId);
    }

    function requestToken() public returns(uint tokenId)
    {
        return _requestToken();
    }

}