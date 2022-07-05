const { assert } = require('chai')

// Contracts
const Wc3MintMock = artifacts.require('Wc3MintMock')

contract('Wc3MintMock', _accounts => {
  describe('mint(): ', () => {
    let wc3
    before(async () => {
      wc3 = await Wc3MintMock.new(
        '0x8d86Bc475bEDCB08179c5e6a4d494EbD3b44Ea8B'
      )
    })

    it('should verify correctly a valid signature', async () => {
      await wc3.mint(
        /* _tokenOwner */ "0x184cc5908e1a3d29b4d31df67d99622c4baa7b71",
        /* _name */ "planned-platypus",
        /* _globalRanking */ 1, 
        /* _guildId */ 1,
        /* _guildPlayers */ 1,
        /* _guildRanking */ 1,
        /* _index */ 0,
        /* _score */ 0,
        // eslint-disable-next-line max-len
        '0xa8ac4dd071e16c7ae27f20961bed4fda2b8ddf9e3f4884878dd61fa49666367512d30fd2e9c78250dff56e246da36e21fd4d158c647e9468f305fbaa144766171b'
      )
    })
  })
})
