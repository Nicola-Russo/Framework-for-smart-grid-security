const Web3 = require('web3');
const web3 = new Web3('http://127.0.0.1:8545'); // connect to Ganache
const contractABI = [{
  "anonymous": false,
  "inputs": [
    {
      "indexed": true,
      "internalType": "address",
      "name": "owner",
      "type": "address"
    },
    {
      "indexed": true,
      "internalType": "address",
      "name": "approved",
      "type": "address"
    },
    {
      "indexed": true,
      "internalType": "uint256",
      "name": "tokenId",
      "type": "uint256"
    }
  ],
  "name": "Approval",
  "type": "event"
},
{
  "anonymous": false,
  "inputs": [
    {
      "indexed": true,
      "internalType": "address",
      "name": "owner",
      "type": "address"
    },
    {
      "indexed": true,
      "internalType": "address",
      "name": "operator",
      "type": "address"
    },
    {
      "indexed": false,
      "internalType": "bool",
      "name": "approved",
      "type": "bool"
    }
  ],
  "name": "ApprovalForAll",
  "type": "event"
},
{
  "anonymous": false,
  "inputs": [
    {
      "indexed": false,
      "internalType": "uint256",
      "name": "provId",
      "type": "uint256"
    },
    {
      "indexed": false,
      "internalType": "uint256",
      "name": "index",
      "type": "uint256"
    },
    {
      "indexed": true,
      "internalType": "uint256",
      "name": "tokenId",
      "type": "uint256"
    },
    {
      "indexed": false,
      "internalType": "string",
      "name": "context",
      "type": "string"
    }
  ],
  "name": "CreateProvenanceEvent",
  "type": "event"
},
{
  "anonymous": false,
  "inputs": [
    {
      "indexed": true,
      "internalType": "uint256",
      "name": "provId",
      "type": "uint256"
    },
    {
      "indexed": false,
      "internalType": "uint256",
      "name": "index",
      "type": "uint256"
    }
  ],
  "name": "DeleteProvenanceEvent",
  "type": "event"
},
{
  "anonymous": false,
  "inputs": [
    {
      "indexed": true,
      "internalType": "address",
      "name": "from",
      "type": "address"
    },
    {
      "indexed": true,
      "internalType": "address",
      "name": "to",
      "type": "address"
    },
    {
      "indexed": true,
      "internalType": "uint256",
      "name": "tokenId",
      "type": "uint256"
    }
  ],
  "name": "Transfer",
  "type": "event"
},
{
  "anonymous": false,
  "inputs": [
    {
      "indexed": true,
      "internalType": "uint256",
      "name": "provId",
      "type": "uint256"
    },
    {
      "indexed": false,
      "internalType": "uint256",
      "name": "index",
      "type": "uint256"
    },
    {
      "indexed": true,
      "internalType": "uint256",
      "name": "tokenId",
      "type": "uint256"
    },
    {
      "indexed": false,
      "internalType": "string",
      "name": "context",
      "type": "string"
    }
  ],
  "name": "UpdateProvenanceEvent",
  "type": "event"
},
{
  "constant": false,
  "inputs": [
    {
      "internalType": "address",
      "name": "to",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "tokenId",
      "type": "uint256"
    }
  ],
  "name": "approve",
  "outputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "constant": true,
  "inputs": [
    {
      "internalType": "address",
      "name": "owner",
      "type": "address"
    }
  ],
  "name": "balanceOf",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
},
{
  "constant": true,
  "inputs": [],
  "name": "baseURI",
  "outputs": [
    {
      "internalType": "string",
      "name": "",
      "type": "string"
    }
  ],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
},
{
  "constant": true,
  "inputs": [
    {
      "internalType": "uint256",
      "name": "tokenId",
      "type": "uint256"
    }
  ],
  "name": "getApproved",
  "outputs": [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    }
  ],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
},
{
  "constant": true,
  "inputs": [
    {
      "internalType": "uint256",
      "name": "_provId",
      "type": "uint256"
    }
  ],
  "name": "getProvenance",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "tokenId",
      "type": "uint256"
    },
    {
      "internalType": "string",
      "name": "context",
      "type": "string"
    },
    {
      "internalType": "uint256",
      "name": "index",
      "type": "uint256"
    }
  ],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
},
{
  "constant": true,
  "inputs": [],
  "name": "getProvenanceCount",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "count",
      "type": "uint256"
    }
  ],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
},
{
  "constant": true,
  "inputs": [
    {
      "internalType": "uint256",
      "name": "_index",
      "type": "uint256"
    }
  ],
  "name": "getProvenanceIdAtIndex",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "provId",
      "type": "uint256"
    }
  ],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
},
{
  "constant": true,
  "inputs": [
    {
      "internalType": "address",
      "name": "owner",
      "type": "address"
    },
    {
      "internalType": "address",
      "name": "operator",
      "type": "address"
    }
  ],
  "name": "isApprovedForAll",
  "outputs": [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
},
{
  "constant": true,
  "inputs": [
    {
      "internalType": "uint256",
      "name": "_provId",
      "type": "uint256"
    }
  ],
  "name": "isProvenance",
  "outputs": [
    {
      "internalType": "bool",
      "name": "isIndeed",
      "type": "bool"
    }
  ],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
},
{
  "constant": true,
  "inputs": [],
  "name": "name",
  "outputs": [
    {
      "internalType": "string",
      "name": "",
      "type": "string"
    }
  ],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
},
{
  "constant": true,
  "inputs": [
    {
      "internalType": "uint256",
      "name": "_tokenId",
      "type": "uint256"
    }
  ],
  "name": "numberOfProvenanceRecordsFor",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
},
{
  "constant": true,
  "inputs": [
    {
      "internalType": "uint256",
      "name": "tokenId",
      "type": "uint256"
    }
  ],
  "name": "ownerOf",
  "outputs": [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    }
  ],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
},
{
  "constant": true,
  "inputs": [
    {
      "internalType": "uint256",
      "name": "_tokenId",
      "type": "uint256"
    },
    {
      "internalType": "uint256",
      "name": "_index",
      "type": "uint256"
    }
  ],
  "name": "provenanceOfTokenByIndex",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "provId",
      "type": "uint256"
    }
  ],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
},
{
  "constant": false,
  "inputs": [
    {
      "internalType": "address",
      "name": "from",
      "type": "address"
    },
    {
      "internalType": "address",
      "name": "to",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "tokenId",
      "type": "uint256"
    }
  ],
  "name": "safeTransferFrom",
  "outputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "constant": false,
  "inputs": [
    {
      "internalType": "address",
      "name": "from",
      "type": "address"
    },
    {
      "internalType": "address",
      "name": "to",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "tokenId",
      "type": "uint256"
    },
    {
      "internalType": "bytes",
      "name": "_data",
      "type": "bytes"
    }
  ],
  "name": "safeTransferFrom",
  "outputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "constant": false,
  "inputs": [
    {
      "internalType": "address",
      "name": "to",
      "type": "address"
    },
    {
      "internalType": "bool",
      "name": "approved",
      "type": "bool"
    }
  ],
  "name": "setApprovalForAll",
  "outputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "constant": true,
  "inputs": [
    {
      "internalType": "bytes4",
      "name": "interfaceId",
      "type": "bytes4"
    }
  ],
  "name": "supportsInterface",
  "outputs": [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
},
{
  "constant": true,
  "inputs": [],
  "name": "symbol",
  "outputs": [
    {
      "internalType": "string",
      "name": "",
      "type": "string"
    }
  ],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
},
{
  "constant": true,
  "inputs": [
    {
      "internalType": "uint256",
      "name": "index",
      "type": "uint256"
    }
  ],
  "name": "tokenByIndex",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
},
{
  "constant": true,
  "inputs": [
    {
      "internalType": "address",
      "name": "owner",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "index",
      "type": "uint256"
    }
  ],
  "name": "tokenOfOwnerByIndex",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
},
{
  "constant": true,
  "inputs": [
    {
      "internalType": "uint256",
      "name": "tokenId",
      "type": "uint256"
    }
  ],
  "name": "tokenURI",
  "outputs": [
    {
      "internalType": "string",
      "name": "",
      "type": "string"
    }
  ],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
},
{
  "constant": true,
  "inputs": [],
  "name": "totalSupply",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
},
{
  "constant": false,
  "inputs": [
    {
      "internalType": "address",
      "name": "from",
      "type": "address"
    },
    {
      "internalType": "address",
      "name": "to",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "tokenId",
      "type": "uint256"
    }
  ],
  "name": "transferFrom",
  "outputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "constant": false,
  "inputs": [
    {
      "internalType": "uint256",
      "name": "_tokenId",
      "type": "uint256"
    },
    {
      "internalType": "string",
      "name": "_context",
      "type": "string"
    }
  ],
  "name": "createProvenance",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "index",
      "type": "uint256"
    }
  ],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "constant": false,
  "inputs": [
    {
      "internalType": "uint256",
      "name": "_provId",
      "type": "uint256"
    },
    {
      "internalType": "uint256",
      "name": "_tokenId",
      "type": "uint256"
    },
    {
      "internalType": "string",
      "name": "_context",
      "type": "string"
    }
  ],
  "name": "updateProvenance",
  "outputs": [
    {
      "internalType": "bool",
      "name": "success",
      "type": "bool"
    }
  ],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "constant": false,
  "inputs": [
    {
      "internalType": "uint256",
      "name": "_provId",
      "type": "uint256"
    }
  ],
  "name": "deleteProvenance",
  "outputs": [
    {
      "internalType": "bool",
      "name": "success",
      "type": "bool"
    }
  ],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "constant": false,
  "inputs": [],
  "name": "requestToken",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "tokenId",
      "type": "uint256"
    }
  ],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}];
const contractAddress = '0x14F35E111d5Ba1F6FD534B00773fC964C547c574';
const accountAddress = '0x06C28B6dA088a0129bbcd7350266A5d94AdC9E57';
const provenance = new web3.eth.Contract(contractABI, contractAddress);
const txObject = {
  from: accountAddress,
  to: contractAddress,
  gasLimit: web3.utils.toHex('6721975'),
};
async function measureWriteTime(dataSize) {
const data = 'x'.repeat(dataSize); // generate test data
const dataHex = web3.utils.asciiToHex(data); // convert data to HEX format

const start = Date.now(); // start timer
provenance.methods.requestToken().send(txObject);
let tokenId = await provenance.methods.requestToken().call();
const tx = await provenance.methods.createProvenance(tokenId, data).send(txObject);
const end = Date.now(); // end timer

const time = end - start;
const dataSizeChars = dataSize;
const gasUsed = tx.gasUsed;
console.log(`Data size: ${dataSizeChars} char, Gas used: ${gasUsed}, Time: ${time} ms`);
}

async function main() {
for (let i = 1; i <= 1000; i++) {   //increasing data in characters
await measureWriteTime(i);
}
}

main();
