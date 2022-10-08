/*
Questo file simula all'interno della architettura di una smart grid il ruolo
del processing unit, in particolare è l'unità che si occupa di fare il fetch dei dati 
dalla PMU, ne effettua il parsing e crea un recor di provenance usando una funzione
di IoTProvenance definita nei contratti, che sono deployati sulla blockchain.
La connessione tra PMU e questa unità viene resa sicura implementando OpenSSL
*/

'use strict'

// Richiesta dei moduli per SSL/TLS
const tls = require('tls');
const fs = require('fs');

// Stiamo dicendo ad OpenSSL di non rigettare le connessioni TLS non autorizzate
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

// Richiesta moduli per comunicare con gli smart contract
const Web3 = require('web3');
const rpcURL ='http://127.0.0.1:8545';
const contractABI = [
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
    }
  ];
const contractAddress = '0x...'; // paste the contract address here
const accountAddress = '0x...'; // paste the account address here

// Creazione di un oggetto web3
const web3 = new Web3(rpcURL);

// Oggetto che contiene i parametri della transazione
const txObject = {
    from: accountAddress,
    to: contractAddress,
    gasLimit: web3.utils.toHex('300000') //gas limit per block, ovvero sto specificando la quantità massima di gas da utilizzare per ogni blocco
};

// Parametri per la connessione alla PMU
const PORT = 8080;// PORT della PMU
const HOSTNAME = '127.0.0.1'; // HOSTNAME della PMU

// Creazione di un'istanza del contratto tramite web3, in questo modo possiamo comunicare con le funzioni esposte 
// dal contratto
var provenance = new web3.eth.Contract(contractABI,contractAddress);

// Passaggio al server del certificato pubblico e della chiave privata con specifica alla PMU di non rigettare certificati non autorizzati
var options = {

    host: "127.0.0.1",
    port: 8080,
    key: fs.readFileSync(`${__dirname}/cert-rsa/Client-key/ProcessingUnit-Key.pem`),
    cert: fs.readFileSync(`${__dirname}/cert-rsa/Client-key/ProcessingUnit-CRT.pem`),

    ca: [fs.readFileSync(`${__dirname}/cert-rsa/Server-key/PMU-CA-CRT.pem`)]

};

// La connessione con la PMU deve avvenire in maniera periodica, in questo caso avviene ogni 10 secondi
setInterval( function(){

     // Connessione alla PMU
     var client = tls.connect(PORT,HOSTNAME, options, function(){

        // Controllo sull'autorizzazione
        if(client.authorized)
        {
            console.log("Connection authorized by Certificate Authority.");
        }
        else{

            // Apparirà in console sempre questo messaggio poiché i certificati sono sel-signed
            console.log("--------------------------------------------------------")
            console.log("\n Connection not authorized "+ client.authorizationError);
        }

        // Invio del comando di START alla PMU per iniziare la trasmissione dei dati 
        // Il comando viene scritto sulla socket dalla P.U. e letto dalla socket dalla PMU
        client.write("START"); 

        //Log invio del comando di start
        console.log("\n START command sent to PMU")

    });

    // Gestione dei dati ricevuti dalla PMU
client.on('data', async function(data){

    // Lettura dei dati inviati dalla PMU sulla socket e parsing in string 
    var dati = data.toString();
    //Log della ricezione dei dati dalla PMU
    console.log("\n Data received from PMU")
    //Log della creazione di nuovi blocchi
    console.log("\n Mining new blocks...")

    // Richiesa allo smart contract di IoTProvenance di fornire un nuovo tokenId per tracciare la nuova misura
    provenance.methods.requestToken().send(txObject);
    // Lettura del tokenId richiesto precedentemente
    let tokenId = await provenance.methods.requestToken().call();
    // Creazione del record di provenance indicizzato con il tokenId, e con i dati della PMU
    provenance.methods.createProvenance(tokenId, dati).send(txObject);

    //Log della creazione di un nuovo record di provenance
    console.log("\n-------------------MINED BLOCKS-------------------")
    console.log("New provenance records for the PMU has been created!");
    console.log("> ETH value of transaction : ~ 0.008 ETH");
    console.log("> Transaction cost (€) : ~ 11,00 €");
    console.log("> Transaction cost ($) : ~ 10,76 $");
    console.log("----------------------------------------------------\n")

    // Chiusura della connessione dopo aver ricevuto i dati e scritti nella blockchain
    client.end();

});


    // Gestione chiusura della connessione
    client.on('close', function(){

        console.log("\n Connection closed");
        console.log("--------------------------------------------------")

    });

    // Gestione degli errori 
    client.on('error', function(error){

        console.error(error);

        // Chiusura della connessione 
        client.destroy();

    });

},10*1000) // 10 secondi = 10* 1000 millisecondi
   

