# Framework for smart grid security
An experimental framework for improving security in the context of smart grids

The proposed experimental framework aims to demonstrate how the use of blockchain technology to implement data provenance is an efficient and effective choice to increase the level of IT security of a critical infrastructure such as that of smart grids, with the aim of protecting the data produced by them in order to address the most worrying vulnerabilities. In particular, we have chosen to adapt to the specific use case of smart grids, a blockchain-based platform called IoTProvenance developed by Marten Sigwart, which allows you to create, modify and invalidate data records, and to store them within the blockchain, going to meet the security requirements, i.e. authenticity, reliability and integrity of data.

The framework was born from the experimental thesis work, therefore it can be improved, but use it with care.

# Try to run 
**Prerequisites**

You need to have the following tools installed:

_Node_

_Ganache EVM (>= 2.1.0)_

_VSCode_

**1) Download the framework and first operations**

Clone the repository

Go to the folder "Processing Unit" and unzip "Dati_simulazione_PMU.zip". 
Once you unzip the data (Magnitude.json and PhaseAngle.json) sure that the two files are in the folder "Processing Unit". 
So you can delete the folder.zip


**2) Deploy Smart Contracts on Ganache**

Change into the project directory: _cd IoTProvenance/_

Install all dependencies: _npm install_

Deploy contracts: _truffle migrate --reset_

**3) Install dependencies of Processing Unit**

Change into the project directory: _cd ProcessingUnit/_

Install all dependencies: _npm install_

Open Ganache and copy the first account address and paste into the file "Processing_unit.js" at the line of code ~ 766. 
After this go into the section "CONTRACTS" of Ganache and search "SpecificProvenance" and copy the address of smart contract and paste into the same file at the line of code ~ 765. 
Save the file.

**4) Run the simulation**

Open a new terminal in VSCode into the project folder "Processing Unit"

Launch the following command: node PMU.js

Open a new terminal in VSCode into the project folder "Processing Unit"

Launch the following command: node Processing_unit.js

**5) Results**
You can see from terminal that new blocks has been mined in Ganache

Open Ganache and go to "Blocks" or "Events" and see the content of new blocks mined that contain the data of PMU

