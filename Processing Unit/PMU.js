/*
Questo file simula all'interno della architettura di una smart grid il ruolo
della PMU, in particolare è l'unità che si occupa di fornire i dati di simulazione
di una PMU al programma "processing_unit.js" in modo che possa creare record di provenance.
La connessione tra PMU e questa unità viene resa sicura implementando OpenSSL
*/

'use strict'

// Richiesta dei moduli SSL/TLS
const tls= require('tls');
const fs = require('fs');

/*
Stiamo dicendo ad OpenSSL di non rigettare le connessioni TLS non autorizzate, ovvero
di non rigettare le connessioni TLS con certificati self-signed, poiché siamo
in ambiente di simulazione. In ambienti di produzione reale, questo parametro deve essere 1
e nelle options bisogna specificare che rejectUnauthorized: true
 */
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

// Definizione del #port e hostname della PMU su cui sarà in ascolto
const PORT = 8080;
const HOSTNAME = '127.0.0.1';

var options = {
    key: fs.readFileSync(`${__dirname}/cert-rsa/Server-key/PMU-key.pem`),
    cert: fs.readFileSync(`${__dirname}/cert-rsa/Server-key/PMU-CRT.pem`),

    ca: [fs.readFileSync(`${__dirname}/cert-rsa/Client-key/ProcessingUnit-CA-CRT.pem`)],
    // Requesting the client to provide a certificate, to authenticate.
    requestCert: true,
    // As specified as "true", so no unauthenticated traffic
    // will make it to the specified route specified
    rejectUnauthorized: false
};

// Fetch dei dati di simulazione della PMU
var Magnitude = require("./Magnitude.json");
var PhaseAngle = require("./PhaseAngle.json");
var i = 0;

// Creazione del server SSL/TLS
var server = tls.createServer(options, function(socket){
    
    // Fetch the timestamp from one of two files 
    var TimeStamp = Magnitude[i++].Timestamp;
    // Operazioni per convertire il timestamp in un formato data-ora leggibile dall'uomo
    var timestamp = new Date(TimeStamp/1000000)
    var date = timestamp.toLocaleString("en-GB");
    //--------------------------------------------
    // Fetch magnitude
    var magnitude = Magnitude[i++].Magnitude;
    // Fetch phase angle
    var phaseangle = PhaseAngle[i++].PhaseAngle;

socket.on('data', function(command){

    if(command=="START")
    {
            console.log("-----------------------------------------------------------------------------------")
            console.log(`\n Processing unit connected as ${socket.remoteAddress} and port ${socket.remotePort}`)
            console.log("\n Command received from processing unit : "+command.toString()+" trasmitting data");
            console.log("\n Sending data of syncrophasor...");
            // La PMU invia i dati alla processing unit
            socket.write("Timestamp : " + date +"\n Magnitude : "+ magnitude+ "\n Phaseangle : "+phaseangle+" from: PMU-1");

            console.log("\n Data sent correctly")

    }
     else{
            console.log("Command not received");
        }

        
        //Handling della chiusura della connessione 
        socket.on('end', function(){
            console.log("\n EOT (End Of Transmission)");
            console.log("----------------------------------------------------------------------------------")
        })

    });

});

// Listening della PMU su #port e hostname
server.listen(PORT,HOSTNAME, function(){
    console.log("PMU listening at %s on port %s", HOSTNAME,PORT);
});

//Gestione degli errori
server.on('error', function(error){
    console.error(error);

    //Chiusura della connessione in caso di errore
    server.destroy();
})