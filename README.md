# Framework for smart grid security
An experimental framework for improving security in the context of smart grids

The proposed experimental framework aims to demonstrate how the use of blockchain technology to implement data provenance is an efficient and effective choice to increase the level of IT security of a critical infrastructure such as that of smart grids, with the aim of protecting the data produced by them in order to address the most worrying vulnerabilities. In particular, we have chosen to adapt to the specific use case of smart grids, a blockchain-based platform called IoTProvenance developed by Marten Sigwart, which allows you to create, modify and invalidate data records, and to store them within the blockchain, going to meet the security requirements, i.e. authenticity, reliability and integrity of data.

The framework was born from the experimental thesis work, therefore it can be improved, but use it with care.

# Try to run 
Prerequisites

You need to have the following tools installed:

Node. \
Ganache (>= 2.1.0). 
VSCode.

# Download the framework and first operations
Clone the repository: git clone git@github.com:NicolaRusso95/Framework_for_smart_grid_security.git
Go to the folder "Processing Unit" and unzip "Dati_simulazione_PMU.zip". Once you unzip the data (Magnitude.json and PhaseAngle.json) sure that the two files are in the folder "Processing Unit". So you can delete the folder.zip


# Deploy Smart Contracts on Ganache

Change into the project directory: cd IoTProvenance/
Install all dependencies: npm install
Deploy contracts: truffle migrate --reset

# Install dependencies of Processing Unit

Change into the project directory: cd ProcessingUnit/
Install all dependencies: npm install

