# Framework for smart grid security
An experimental framework for improving security in the context of smart grids

The proposed experimental framework aims to demonstrate how the use of blockchain technology to implement data provenance is an efficient and effective choice to increase the level of IT security of a critical infrastructure such as that of smart grids, with the aim of protecting the data produced by them in order to address the most worrying vulnerabilities. In particular, we have chosen to adapt to the specific use case of smart grids, a blockchain-based platform called IoTProvenance developed by Marten Sigwart, which allows you to create, modify and invalidate data records, and to store them within the blockchain, going to meet the security requirements, i.e. authenticity, reliability and integrity of data. In order to ensure a better efficiency and optimization of costs, we implemented a caching mechanism that allows the user to decide if the data is going to get stored in the blockchain or not.

The framework is currently subject of on-going research, use it with care.

# Try to run 

### Prerequisites

You need to have the following tools installed:

_Node_

_Ganache EVM (>= 2.1.0)_

_VSCode_

_Truffle_

_Linux OS recommended_ 

### 1) Download the framework and first operations

Clone the repository via _VSCode_ 

Go to the folder "TLS_Processing unit" and unzip "Sensor_data.zip". 
Once you unzip the data (Magnitude.json and PhaseAngle.json) sure that the two files are in the folder "TLS_Processing unit". 
So you can delete the folder.zip

Open Ganache and create a new workspace (ethereum). #### IMPORTANT: port number of workspace must be 8545


## 2) Deploy Smart Contracts on Ganache

Change into the project directory: _cd Data provenance platform based on blockchain tecnology/_

Install all dependencies: _npm install_

Delete the directory _Data_ if has been created at the end of _npm install_

Open Ganache and select "Add project" from setting menu and add "truffle-config.js" file from "Data provenance platform based on blockchain tecnology" folder

Deploy contracts: _truffle migrate --reset_

## 3) Install dependencies of Processing Unit

Change into the project directory: _cd TLS_Processing unit/_

Install all dependencies: _npm install_

Open Ganache and copy the first account address and paste into the file "Processing_unit.js" at the line of code ~ 767. 
After this go into the section "CONTRACTS" of Ganache and search "SpecificProvenance" and copy the address of smart contract and paste into the same file at the line of code ~ 766. 
Save the file.

## 4) Run the simulation

Open a new terminal in _VSCode_ into the project folder "TLS_Processing unit"

Launch the following command: _node PMU.js_

Open a new terminal in _VSCode_ into the project folder "TLS_Processing unit"

Launch the following command: _node Processing_unit.js_

Every 10 seconds the Processing_unit will send a "START trasmitting data" command throw a TLS connection to the PMU and after received the data the Processing unit request a _tokenId_ to IoTProvenance and create a new provenance record. You can stop this process using _CTRL+C_ in the terminal of Processing_Unit.js

## 5) Results
You can see from terminal that new blocks has been mined in Ganache

Open Ganache and go to "Blocks" or "Events" and see the content of new mined blocks which contains the data of PMU. So for each packet of data received from PMU will be mined two new blocks.

