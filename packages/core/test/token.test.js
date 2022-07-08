const { assert } = require('chai')
const truffleAssert = require('truffle-assertions')
const package = require('../package')
const settings = require('../migrations/settings')

const Wc3Token = artifacts.require('Wc3Token')
const Wc3Decorator = artifacts.require('Wc3Decorator')

const WitnetPriceRouterMock = artifacts.require('WitnetPriceRouterMock')
const WitnetRandomnessMock = artifacts.require('WitnetRandomnessMock')

contract('Wc3Token', accounts => {
  let wc3
  let owner = accounts[0]
  let stranger = accounts[1]
  let signator = accounts[4]
  let eggOwner0 = '0x184cc5908e1a3d29b4d31df67d99622c4baa7b71'
  let eggOwner1 = accounts[2]
  let eggOwner2 = accounts[3]
  let eggSignator = '0x12890D2cce102216644c59daE5baed380d84830c'
  let guildId
  const randomizeBlocks = 15
  const randomizeFee = 10000
  const finalSignator = '0x8d86Bc475bEDCB08179c5e6a4d494EbD3b44Ea8B'
  before(async () => {
    const randomizer = await WitnetRandomnessMock.new(
      randomizeBlocks,
      randomizeFee,
    )
    const router = await WitnetPriceRouterMock.new(
      "Price-ETH/USD-6", // _caption
      1234123456, // _price ($1,234.12)
    )
    wc3 = await Wc3Token.new(
      `${package.version}-test`,
      randomizer.address,
      router.address,
      Wc3Decorator.address,
      signator,
      [20, 30, 50], // percentile marks
      0, // expiration blocks
      99, // totalEggs
      "Price-ETH/USD-6", // usd price caption
      settings.specs.default.mintGasOverhead,
    )
    guildId = await wc3.guildId.call()
    // console.log("mintGasOverhead =>", (await wc3.getMintGasOverhead()).toString())
    // console.log("guildId =>", guildId.toString())
  })
  describe('Storage-machine happy path', async () => {
    describe("In status: 'Batching'", async () => {
      beforeEach(async () => {
        let status = await wc3.getStatus.call()
        assert.equal(status.toString(), '0')
      })
      describe('IWc3Surrogates', async () => {
        describe('mint(..)', async () => {
          it('creatures cannot be minted', async () => {
            await truffleAssert.reverts(
              wc3.mint(
                eggOwner0,
                "planned-platypus", // _eggName
                1, // _eggGlobalRanking
                1337, // _eggGuildId
                1, // _eggGuildPlayers
                1, // _eggGuildRanking,
                0, // _eggIndex
                0, // _eggScore
                '0xa8ac4dd071e16c7ae27f20961bed4fda2b8ddf9e3f4884878dd61fa49666367512d30fd2e9c78250dff56e246da36e21fd4d158c647e9468f305fbaa144766171b'
              ),
              'not in Hatching'
            )
          })
        })
      })
      describe('IWc3View', async () => {
        describe('getHatchingBlock()', async () => {
          it('hatching block is zero', async () => {
            const block = await wc3.getHatchingBlock.call()
            assert.equal(block.toString(), '0')
          })
        })
        describe('getTokenStatus(..)', async () => {
          it("token #0 should always be 'Void'", async () => {
            const status = await wc3.getTokenStatus.call(0)
            assert.equal(status.toString(), '0')
          })
          it("token #999 should always be 'Void'", async () => {
            const status = await wc3.getTokenStatus.call(999)
            assert.equal(status.toString(), '0')
          })
          it("token #1 remains in status 'Incubating'", async () => {
            const status = await wc3.getTokenStatus.call(1)
            assert.equal(status.toString(), '1')
          })
        })
        describe('preview(..)', async () => {
          it('creatures cannot be previewed', async () => {
            await truffleAssert.reverts(
              wc3.preview(
                "planned-platypus", // _eggName
                1, // _eggGlobalRanking
                1337, // _eggGuildId
                1, // _eggGuildPlayers
                1, // _eggGuildRanking,
                0, // _eggIndex
                0, // _eggScore
              ),
              'not in Hatching'
            )
          })
        })
      })
      describe('IWc3Admin', async () => {
        describe('setDecorator(..)', async () => {
          it('signator cannot change decorator', async () => {
            await truffleAssert.reverts(
              wc3.setDecorator(stranger, { from: signator }),
              'Ownable'
            )
          })
          it('stranger cannot change decorator', async () => {
            await truffleAssert.reverts(
              wc3.setDecorator(stranger, { from: stranger }),
              'Ownable'
            )
          })
          it('decorator cannot be set to zero', async () => {
            await truffleAssert.reverts(
              wc3.setDecorator(
                '0x0000000000000000000000000000000000000000',
                { from: owner }
              ),
              'no decorator'
            )
          })
          it('owner can change decorator', async () => {
            await wc3.setDecorator(Wc3Decorator.address, { from: owner })
          })
        })
        describe('setMintGasOverhead(..)', async () => {
          it('stranger cannot change mint gas overhead', async () => {
            await truffleAssert.reverts(
              wc3.setMintGasOverhead(50000, { from: stranger }),
              'Ownable'
            )
          })
          it('signator cannot change mint gas overhead', async () => {
            await truffleAssert.reverts(
              wc3.setMintGasOverhead(50000, { from: signator }),
              'Ownable'
            )
          })
          it('owner can change mint gas overhead', async () => {
            wc3.setMintGasOverhead(50000, { from: owner })
          })
        })
        describe('setSettings(..)', async () => {
          it('stranger cannot change parameters', async () => {
            await truffleAssert.reverts(
              wc3.setSettings(80640, 99, [20, 30, 50], {
                from: stranger,
              }),
              'Ownable'
            )
          })
          it('signator cannot change parameters', async () => {
            await truffleAssert.reverts(
              wc3.setSettings(80640, 99, [20, 30, 50], {
                from: signator,
              }),
              'Ownable'
            )
          })
          it('fails if bad number of percentiles is passed', async () => {
            await truffleAssert.reverts(
              wc3.setSettings(0, 99, [10, 30],{ from: owner })
            )
          })
          it("fails if percentiles don't sum up 100", async () => {
            await truffleAssert.reverts(
              wc3.setSettings(0, 99, [10, 30, 55], {
                from: owner,
                gas: 100000,
              })
            )
          })
          it('owner can change valid parameters', async () => {
            await wc3.setSettings(80640, 99, [20, 30, 50], {
              from: owner,
            })
          })
        })
        describe('setSignator(..)', async () => {
          it('stranger cannot change signator', async () => {
            await truffleAssert.reverts(
              wc3.setSignator(stranger, { from: stranger }),
              'Ownable'
            )
          })
          it('signator cannot change signator', async () => {
            await truffleAssert.reverts(
              wc3.setSignator(stranger, { from: signator }),
              'Ownable'
            )
          })
          it('signator cannot be set to zero', async () => {
            await truffleAssert.reverts(
              wc3.setSignator(
                '0x0000000000000000000000000000000000000000',
                { from: owner }
              )
            )
          })
          it('owner can change signator', async () => {
            await wc3.setSignator(signator, { from: owner })
          })
        })
        describe('startHatching() payable', async () => {
          it('signator cannot start hatching', async () => {
            await truffleAssert.reverts(
              wc3.startHatching({
                from: signator,
                value: randomizeFee,
              }),
              'Ownable'
            )
          })
          it('stranger cannot start hatching', async () => {
            await truffleAssert.reverts(
              wc3.startHatching({
                from: stranger,
                value: randomizeFee, 
              }),
              'Ownable'
            )
          })
          it('hatching cannot start if decorator is not forged', async () => {
            await truffleAssert.reverts(
              wc3.startHatching({
                from: owner,
                value: randomizeFee / 2, 
              }),
              'unforged decorator'
            )
          })
          it('owner can forge decorator', async () => {
            const decorator = await Wc3Decorator.deployed()
            await decorator.forge({
              from: owner
            })
          })
          it('hatching cannot start if not enough randomize fee is paid', async () => {
            await truffleAssert.reverts(
              wc3.startHatching({
                from: owner,
                value: randomizeFee / 2, 
              })
            )
          })
          it('owner can start hatching', async () => {
            await wc3.startHatching({
              from: owner,
              value: randomizeFee,
            })
            // check status changed to 'Randomizing'
            let status = await wc3.getStatus.call()
            assert.equal(status.toString(), '1')
          })
        })
      })
    })
    describe("In status: 'Randomizing'", async () => {
      beforeEach(async () => {
        let status = await wc3.getStatus.call()
        assert.equal(status.toString(), '1')
      })
      describe('IWc3Surrogates', async () => {
        describe('mint(..)', async () => {
          it('creatures cannot be minted yet', async () => {
            await truffleAssert.reverts(
              wc3.mint(
                eggOwner0,
                "planned-platypus", // _eggName
                1, // _eggGlobalRanking
                1337, // _eggGuildId
                1, // _eggGuildPlayers
                1, // _eggGuildRanking,
                0, // _eggIndex
                0, // _eggScore
                '0xa8ac4dd071e16c7ae27f20961bed4fda2b8ddf9e3f4884878dd61fa49666367512d30fd2e9c78250dff56e246da36e21fd4d158c647e9468f305fbaa144766171b'
              ),
              'not in Hatching'
            )
          })
        })
      })
      describe('IWc3View', async () => {
        describe('getHatchingBlock()', async () => {
          it('hatching block is not zero', async () => {
            const block = await wc3.getHatchingBlock.call()
            assert(block.toString() !== '0')
          })
        })
        describe('getTokenStatus(..)', async () => {
          it("token #0 should always be 'Void'", async () => {
            const status = await wc3.getTokenStatus.call(0)
            assert.equal(status.toString(), '0')
          })
          it("token #999 should always be 'Void'", async () => {
            const status = await wc3.getTokenStatus.call(999)
            assert.equal(status.toString(), '0')
          })
          it("token #1 is now pre-set in status 'Randomizing'", async () => {
            const status = await wc3.getTokenStatus.call(1)
            assert.equal(status.toString(), '2')
          })
        })
        describe('preview(..)', async () => {
          it('creatures cannot be previewed', async () => {
            await truffleAssert.reverts(
              wc3.preview(
                "planned-platypus", // _eggName
                1, // _eggGlobalRanking
                1337, // _eggGuildId
                1, // _eggGuildPlayers
                1, // _eggGuildRanking,
                0, // _eggIndex
                0, // _eggScore
              ),
              'not in Hatching'
            )
          })
        })
      })
      describe('IWc3Admin', async () => {
        describe('setDecorator(..)', async () => {
          it('owner cannot change decorator', async () => {
            await truffleAssert.reverts(
              wc3.setDecorator(Wc3Decorator.address, { from: owner }),
              'not in Batching',
            )
          })
        })
        describe('setMintGasOverhead(..)', async () => {
          it('stranger cannot change mint gas overhead', async () => {
            await truffleAssert.reverts(
              wc3.setMintGasOverhead(50000, { from: stranger }),
              'Ownable'
            )
          })
          it('signator cannot change mint gas overhead', async () => {
            await truffleAssert.reverts(
              wc3.setMintGasOverhead(50000, { from: signator }),
              'Ownable'
            )
          })
          it('owner can change mint gas overhead', async () => {
            wc3.setMintGasOverhead(50000, { from: owner })
          })
        })
        describe('setSettings(..)', async () => {
          it('owner cannot change settings anymore', async () => {
            await truffleAssert.reverts(
              wc3.setSettings(80640, 99, [20, 30, 50], { from: owner, }),
              'not in Batching'
            )
          })
        })
        describe('setSignator(..)', async () => {
          it('stranger cannot change signator', async () => {
            await truffleAssert.reverts(
              wc3.setSignator(stranger, { from: stranger }),
              'Ownable'
            )
          })
          it('signator cannot change signator', async () => {
            await truffleAssert.reverts(
              wc3.setSignator(stranger, { from: signator }),
              'Ownable'
            )
          })
          it('signator cannot be set to zero', async () => {
            await truffleAssert.reverts(
              wc3.setSignator(
                '0x0000000000000000000000000000000000000000',
                { from: owner }
              )
            )
          })
          it('owner can change signator', async () => {
            await wc3.setSignator(signator, { from: owner })
          })
        })
        describe('startHatching() payable', async () => {
          it('hatching cannot restart', async () => {
            await truffleAssert.reverts(
              wc3.startHatching({
                from: owner,
                value: randomizeFee,
              }),
              'not in Batching'
            )
          })
          it('contract eventually turns to Hatching status', async () => {
            let randomness = '0x0000000000000000000000000000000000000000000000000000000000000000'
            do {
              try {
                await wc3.setSignator(signator, { from: owner })
                randomness = await wc3.getHatchingRandomness()
              } catch {}
            } while (randomness === '0x0000000000000000000000000000000000000000000000000000000000000000')
            console.log("              ", randomness)
          })
        })
      }) 
    })
    describe("In status: 'Hatching'", async () => {
      beforeEach(async () => {
        let status = await wc3.getStatus.call()
        assert.equal(status.toString(), '2')
      })
      describe('IWc3View', async () => {
        describe('getHatchingBlock()', async () => {
          it('hatching block is not zero', async () => {
            const block = await wc3.getHatchingBlock.call()
            assert(block.toString() !== '0')
          })
        })
        describe('getTokenStatus(..)', async () => {
          it("token #0 should always be 'Void'", async () => {
            const status = await wc3.getTokenStatus.call(0)
            assert.equal(status.toString(), '0')
          })
          it("token #999 should always be 'Void'", async () => {
            const status = await wc3.getTokenStatus.call(999)
            assert.equal(status.toString(), '0')
          })
          it("token #1 turns to status 'Hatching'", async () => {
            const status = await wc3.getTokenStatus.call(1)
            assert.equal(status.toString(), '3')
          })
        })
        describe('preview(..)', async () => {
          it('creatures can now be previewed', async () => {
            await wc3.preview(
              "planned-platypus", // _eggName
              1, // _eggGlobalRanking
              1337, // _eggGuildId
              11, // _eggGuildPlayers
              2, // _eggGuildRanking,
              0, // _eggIndex
              0, // _eggScore
            )
          })
        })
      })
      describe('IWc3Admin', async () => {
        describe('setDecorator(..)', async () => {
          it('owner cannot change decorator', async () => {
            await truffleAssert.reverts(
              wc3.setDecorator(Wc3Decorator.address, { from: owner }),
              'not in Batching',
            )
          })
        })
        describe('setMintGasOverhead(..)', async () => {
          it('stranger cannot change mint gas overhead', async () => {
            await truffleAssert.reverts(
              wc3.setMintGasOverhead(50000, { from: stranger }),
              'Ownable'
            )
          })
          it('signator cannot change mint gas overhead', async () => {
            await truffleAssert.reverts(
              wc3.setMintGasOverhead(50000, { from: signator }),
              'Ownable'
            )
          })
          it('owner can change mint gas overhead', async () => {
            wc3.setMintGasOverhead(settings.specs.default.mintGasOverhead, { from: owner })
          })
        })
        describe('setSettings(..)', async () => {
          it('owner cannot change settings anymore', async () => {
            await truffleAssert.reverts(
              wc3.setSettings(80640, 99, [20, 30, 50], { from: owner, }),
              'not in Batching'
            )
          })
        })
        describe('setSignator(..)', async () => {
          it('stranger cannot change signator', async () => {
            await truffleAssert.reverts(
              wc3.setSignator(stranger, { from: stranger }),
              'Ownable'
            )
          })
          it('signator cannot change signator', async () => {
            await truffleAssert.reverts(
              wc3.setSignator(stranger, { from: signator }),
              'Ownable'
            )
          })
          it('signator cannot be set to zero', async () => {
            await truffleAssert.reverts(
              wc3.setSignator(
                '0x0000000000000000000000000000000000000000',
                { from: owner }
              )
            )
          })
          it('owner can change signator', async () => {
            await wc3.setSignator(finalSignator, { from: owner })
          })
        })
        describe('startHatching() payable', async () => {
          it('hatching cannot restart', async () => {
            await truffleAssert.reverts(
              wc3.startHatching({
                from: owner,
                value: randomizeFee,
              }),
              'not in Batching'
            )
          })
          // it('contract eventually turns to Frozen status', async () => {
          //   while((await wc3.getStatus()).toString() === '2');
          // })
        })
        describe('IWc3Surrogates', async () => {
          describe('mint(..)', async () => {
            it('fails if trying to malleate egg owner', async () => {
              await truffleAssert.reverts(
                wc3.mint(
                  stranger, // _eggOwner
                  "planned-platypus", // _eggName
                  1, // _eggGlobalRanking
                  1337, // _eggGuildId
                  1, // _eggGuildPlayers
                  1, // _eggGuildRanking,
                  0, // _eggIndex
                  0, // _eggScore
                  '0x6b0c0308de8839d54972c68a0538bdc8e11fd9cf46c9c1809eabf6c64e7941d0515129c8e0bc6e9ca958965d034615584c7e3336485574bf1b5cc4242c38332b1c'
                ),
                'bad signature'
              )
            })
            it('fails if trying to malleate egg index', async () => {
              await truffleAssert.reverts(
                wc3.mint(
                  "0x184cc5908e1a3d29b4d31df67d99622c4baa7b71", // _eggOwner
                  "planned-platypus", // _eggName
                  1, // _eggGlobalRanking
                  1337, // _eggGuildId
                  1, // _eggGuildPlayers
                  1, // _eggGuildRanking,
                  1, // _eggIndex
                  0, // _eggScore
                  '0x6b0c0308de8839d54972c68a0538bdc8e11fd9cf46c9c1809eabf6c64e7941d0515129c8e0bc6e9ca958965d034615584c7e3336485574bf1b5cc4242c38332b1c'
                ),
                'bad signature'
              )
            })
            it('fails if trying to malleate egg score', async () => {
              await truffleAssert.reverts(
                wc3.mint(
                  "0x184cc5908e1a3d29b4d31df67d99622c4baa7b71", // _eggOwner
                  "planned-platypus", // _eggName
                  1, // _eggGlobalRanking
                  1337, // _eggGuildId
                  1, // _eggGuildPlayers
                  1, // _eggGuildRanking,
                  0, // _eggIndex
                  1, // _eggScore
                  '0x6b0c0308de8839d54972c68a0538bdc8e11fd9cf46c9c1809eabf6c64e7941d0515129c8e0bc6e9ca958965d034615584c7e3336485574bf1b5cc4242c38332b1c'
                ),
                'bad signature'
              )
            })
            it('fails if trying to malleate egg global ranking', async () => {
              await truffleAssert.reverts(
                wc3.mint(
                  "0x184cc5908e1a3d29b4d31df67d99622c4baa7b71", // _eggOwner
                  "planned-platypus", // _eggName
                  2, // _eggGlobalRanking
                  1337, // _eggGuildId
                  1, // _eggGuildPlayers
                  1, // _eggGuildRanking,
                  0, // _eggIndex
                  0, // _eggScore
                  '0x6b0c0308de8839d54972c68a0538bdc8e11fd9cf46c9c1809eabf6c64e7941d0515129c8e0bc6e9ca958965d034615584c7e3336485574bf1b5cc4242c38332b1c'
                ),
                'bad signature'
              )
            })
            it('fails if trying to malleate guild players', async () => {
              await truffleAssert.reverts(
                wc3.mint(
                  "0x184cc5908e1a3d29b4d31df67d99622c4baa7b71",
                  "planned-platypus", // _eggName
                  1, // _eggGlobalRanking
                  1337, // _eggGuildId
                  2, // _eggGuildPlayers
                  1, // _eggGuildRanking,
                  0, // _eggIndex
                  0, // _eggScore
                  '0x6b0c0308de8839d54972c68a0538bdc8e11fd9cf46c9c1809eabf6c64e7941d0515129c8e0bc6e9ca958965d034615584c7e3336485574bf1b5cc4242c38332b1c'
                ),
                'bad signature'
              )
            })
            it('common creature can be minted by anyone', async () => {
              const _rx = await wc3.mint(
                "0x184cc5908e1a3d29b4d31df67d99622c4baa7b71",
                "planned-platypus", // _eggName
                1, // _eggGlobalRanking
                1337, // _eggGuildId
                1, // _eggGuildPlayers
                1, // _eggGuildRanking,
                0, // _eggIndex
                0, // _eggScore
                '0x6b0c0308de8839d54972c68a0538bdc8e11fd9cf46c9c1809eabf6c64e7941d0515129c8e0bc6e9ca958965d034615584c7e3336485574bf1b5cc4242c38332b1c',
                {
                  from: stranger,
                  gas: 500000
                }
              )
              // checks that creature #0 is now in 'Minted' status:
              let _status = await wc3.getTokenStatus.call(1)
              assert.equal(_status.toString(), '4')
              // checks creature category is Common
              let _data = await wc3.getTokenIntrinsics.call(1)
              assert.equal(_data.eggRarity.toString(), '2')
              // console.log("rx =>", _rx)
              // console.log("_data =>", _data)
            })
            it('minted creature cannot be minted twice', async () => {
              await truffleAssert.reverts(
                wc3.mint(
                  "0x184cc5908e1a3d29b4d31df67d99622c4baa7b71",
                  "planned-platypus", // _eggName
                  1, // _eggGlobalRanking
                  1337, // _eggGuildId
                  1, // _eggGuildPlayers
                  1, // _eggGuildRanking,
                  0, // _eggIndex
                  0, // _eggScore
                  '0x6b0c0308de8839d54972c68a0538bdc8e11fd9cf46c9c1809eabf6c64e7941d0515129c8e0bc6e9ca958965d034615584c7e3336485574bf1b5cc4242c38332b1c',
                  {
                    from: owner,
                    gas: 500000
                  }
                ),
                'already minted'
              )
            })
            it('rare creature can be minted by anyone', async () => {
              const _rx = await wc3.mint(
                "0x12890D2cce102216644c59daE5baed380d84830c",
                "planned-platypus", // _eggName
                7, // _eggGlobalRanking
                1337, // _eggGuildId
                11, // _eggGuildPlayers
                5, // _eggGuildRanking,
                9, // _eggIndex
                222, // _eggScore
                '0x2a390b2fbe619158c0f0029484eeda6ee584590e359f39381bae38db00561a466c31c767ecd2892220890e1a1062ed597217eb50a5a890ca2b0bb0d83e3ea7e81b',
                {
                  from: stranger,
                  gas: 500000
                }
              )
              // checks that creature #0 is now in 'Minted' status:
              let _status = await wc3.getTokenStatus.call(5)
              assert.equal(_status.toString(), '4')
              // checks creature category is Common
              let _data = await wc3.getTokenIntrinsics.call(5)
              assert.equal(_data.eggRarity.toString(), '1')
            })
            it('legendary creature can be minted by anyone', async () => {
              const _rx = await wc3.mint(
                "0x12890D2cce102216644c59daE5baed380d84830c",
                "planned-platypus", // _eggName
                7, // _eggGlobalRanking
                1337, // _eggGuildId
                11, // _eggGuildPlayers
                2, // _eggGuildRanking,
                4, // _eggIndex
                456, // _eggScore
                '0x657929f3ab521db62b9cb51419bf944146c14ccc33b4b96d9e8ee660be24769e43d3e6356fc5c57e16ea6f40c47a6aec6df35d73b3a9a2962b9a1ec262536f5e1c',
                {
                  from: stranger,
                  gas: 500000
                }
              )
              // checks that creature #0 is now in 'Minted' status:
              let _status = await wc3.getTokenStatus.call(2)
              assert.equal(_status.toString(), '4')
              // checks creature category is Common
              let _data = await wc3.getTokenIntrinsics.call(2)
              assert.equal(_data.eggRarity.toString(), '0')
            })
          })
        })
      })
    })
  })
})
