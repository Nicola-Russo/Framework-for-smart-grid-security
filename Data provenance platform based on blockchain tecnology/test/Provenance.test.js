const ProvenanceContract = artifacts.require("SpecificProvenance");

const {expectRevert} = require('@openzeppelin/test-helpers');
const {toProvenanceRecord} = require('./utils');
const {expect} = require('chai');


contract("ProvenanceContract", async (accounts) => {

  let provenance;

  before(async () => {
    provenance = await ProvenanceContract.deployed();
  });

  it("should initialise correctly", async () => {
    const count = await provenance.getProvenanceCount.call();
    assert.equal(count.valueOf(), 0, "The contract should have 0 provenance records initially");
  });

  it("should return a different ID every time requestToken() is called", async () => {
    for (let i of [...Array(10).keys()]) {
      await provenance.requestToken();
    }
  });


  /**
   * 'Create' reverts if
   *   - the given token ID does not exist.
   *   - the sender is not the owner of the token ID.
   *   – the given input provenance IDs do not exist.
   */
  it("should revert when creating a provenance record with a non-existent data ID", async () => {
    await expectRevert.unspecified(provenance.createProvenance(0, "contextA"));
  });

  it("should revert when creating a provenance record where the sender is not the owner of the data ID", async () => {
    const dataId = await requestToken(provenance, accounts[0]);
    await provenance.createProvenance(dataId, "originalContext", {from: accounts[0]}); // this should work
    await expectRevert.unspecified(provenance.createProvenance(dataId, "fakeContext", {from: accounts[1]})); // this should not
  });


  /**
   * 'Update' reverts if
   *   - the provenance record of the given provenance ID does not exist.
   *   - the given updated data ID does not exist.
   *   - the sender is not the owner of the old data ID.
   *   - the sender is not the owner of the new data ID.
   *   - the updated input provenance IDs do not exist.
   */
  it("should revert when trying to update a non-existent provenance record", async () => {
    const dataId = await requestToken(provenance, accounts[0]);
    await expectRevert.unspecified(provenance.updateProvenance(0, dataId, "updatedContext"));
  });

  it("should revert when updating a provenance record with a non-existent data ID", async () => {
    const dataId = await requestToken(provenance, accounts[0]);
    await provenance.createProvenance(dataId, "originalContext");
    const provId = await provenance.provenanceOfTokenByIndex(dataId, 0);
    const nonExistentDataId = dataId + 1;
    await expectRevert.unspecified(provenance.updateProvenance(provId, nonExistentDataId,  "updatedContext"));
  });


  it("should revert when updating a provenance record where the sender is not the owner of the new data ID", async () => {
    const dataId0 = await requestToken(provenance, accounts[0]);
    const dataId1 = await requestToken(provenance, accounts[0]);
    const provId = await createProvenanceRecord(provenance, accounts[0], dataId0, "context");
    await expectRevert.unspecified(provenance.updateProvenance(provId, dataId1, "forgedContext", {from: accounts[1]}));
  });

  it("should revert when updating a provenance record where the sender is not the owner of the old data ID", async () => {
    const dataId = await requestToken(provenance, accounts[0]);
    const provId = await createProvenanceRecord(provenance, accounts[0], dataId, "context");
    await expectRevert.unspecified(provenance.updateProvenance(provId, dataId, "forgedContext", {from: accounts[1]}));
  });

  /**
   * 'Delete' reverts if
   *   - the provenance record of the given provenance ID does not exist.
   *   - the sender is not the owner of the data ID of the provenance record.
   */
  it("should revert when trying to delete a non-existent provenance record", async () => {
    const nonExistentProvId = await getNonExistentProvId(provenance);
    await expectRevert.unspecified(provenance.deleteProvenance(nonExistentProvId));
  });

  it("should revert when deleting a provenance record where the sender is not the owner of the data ID", async () => {
    const dataId = await requestToken(provenance, accounts[0]);
    const provId = await createProvenanceRecord(provenance, accounts[0], dataId, "context");
    await expectRevert.unspecified(provenance.deleteProvenance(provId, {from: accounts[1]}), "");
  });


});

async function requestToken(provenance, account) {
  await provenance.requestToken({from: account});
  const balance = await provenance.balanceOf(account);
  return await provenance.tokenOfOwnerByIndex(account, balance-1);
}

async function createProvenanceRecord(provenance, account, tokenId, context, inputProvIds) {
  await provenance.createProvenance(tokenId, context, {from: account});
  const amountProvenance = await provenance.numberOfProvenanceRecordsFor.call(tokenId, {from: account});
  return await provenance.provenanceOfTokenByIndex.call(tokenId, amountProvenance-1, {from: account});
}

async function checkBalance(provenance, tokenId, expected) {
  const balance = await provenance.numberOfProvenanceRecordsFor.call(tokenId);
  assert.equal(expected.valueOf(), balance.valueOf(), "the amount of provenance records is not correct");
}

async function getNonExistentProvId(provenance) {
  const provCount = await provenance.getProvenanceCount.call();
  let nonExistentId = 0;
  for (let i=0; i<provCount.valueOf(); i++) {
    let provId = await provenance.getProvenanceIdAtIndex.call(i);
    nonExistentId = provId > nonExistentId ? provId : nonExistentId;
  }
  return ++nonExistentId;
}
