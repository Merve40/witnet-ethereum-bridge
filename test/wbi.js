const WBI = artifacts.require("WitnetBridgeInterface")

contract("WBI", _accounts => {
  describe("WBI test suite", () => {
    let wbiInstance
    before(async () => {
      wbiInstance = await WBI.deployed()
    })

    it("should allow post and read drs", async () => {
      const waitForHash = (txQ) => new Promise((resolve, reject) => txQ.on('transactionHash', hash => resolve(hash)).catch(reject))

      const drBytes = web3.utils.fromAscii("This is a DR?")
      console.log(`Data request bytes: ${drBytes}`)

      // Get id the easy way
      const idComputed = await wbiInstance.post_dr.call(drBytes, 1)
      // console.log(`Id computed: ${idComputed}`)

      const tx = wbiInstance.post_dr(drBytes, 1)
      await waitForHash(tx)

      let readDrBytes = await wbiInstance.read_dr.call(idComputed)
      // console.log(`Data request bytes read from Contract: ${readDrBytes}`)

      assert.equal(drBytes, readDrBytes)
    });
    it("should allow post and read result", async () => {
      const waitForHash = (txQ) => new Promise((resolve, reject) => txQ.on('transactionHash', hash => resolve(hash)).catch(reject))

      const drBytes = web3.utils.fromAscii("This is a DR?")
      const resBytes = web3.utils.fromAscii("This is a result?")

      // Get id the easy way
      const idComputed = await wbiInstance.post_dr.call(drBytes, 1)
      // console.log(`Id computed: ${idComputed}`)

      const tx = wbiInstance.post_dr(drBytes, 1)
      await waitForHash(tx)

      // report result
      let restx = wbiInstance.report_result(idComputed, resBytes)
      await waitForHash(restx)

      let readResBytes = await wbiInstance.read_result.call(idComputed)

      assert.equal(resBytes, readResBytes)
    });
  })
})
