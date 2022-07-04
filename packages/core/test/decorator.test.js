const { assert } = require('chai')
// const truffleAssert = require("truffle-assertions");
const Wc3Decorator = artifacts.require('Wc3Decorator')

contract('Wc3Decorator', _accounts => {
  let decorator
  let randomness

  before(async () => {
    decorator = await Wc3Decorator.deployed()
  })

  describe('IWc3Decorator', async () => {
    describe('baseURI()', async () => {
      let baseURI
      it('returns no empty string', async () => {
        baseURI = await decorator.baseURI.call()
        assert(baseURI.length > 0)
      })
      it('ends up with slash', () => {
        assert(baseURI[baseURI.length - 1] === '/')
      })
    })
    describe('toJSON(bytes32,WittyCreature)', async () => {
      let metadatas = []
      let randomness
      describe('common creatures', async () => {
        randomness = "0xb754d49eec4434a3bd789100715ca6a0f7230fe7b66a2cd93457616128bbc5c2"
        before('baseURI()', async () => {
          for (let j = 0; j < 50; j++) {
            metadatas[j] = await decorator.toJSON.call(
              randomness,
              [
                /* name*/ `Name${j}`,
                /* birthTimestamp */ parseInt(Math.floor(Date.now() / 1000)),
                /* globalRanking */ 123 - j,
                /* guildRanking */ 1 + parseInt(Math.random() * 50),
                /* index */ j,
                /* mintUsdCost6 */ 123450000,
                /* rarity */ 2,
                /* score */ 12345 + (50 - j) * 99,
              ]
            )
          }
        })
        it("generates valid JSON", async () => {
          for (let j = 0; j < metadatas.length; j++) {
            try {
              await JSON.parse(metadatas[j])
            } catch (ex) {
              console.log(`metadata[${j}] => ${await metadatas[j]}`)
              throw ex
            }
          }
        })
        it("metadata description contains index", async () => {
          for (let j = 0; j < metadatas.length; j++) {
            const metadata = await JSON.parse(metadatas[j])
            try {
              assert(
                metadata.description.indexOf(j.toString()) >= 0,
                `Token id #${j} not found:\n${await metadatas[j]}`
              )
            } catch (ex) {
              console.log(`metadata[${j}] => ${ex}\n${metadatas[j]}`)
              throw ex
            }
          }
        })
        it("metadata contains default background attribute", async () => {
          for (let j = 0; j < metadatas.length; j++) {
            const metadata = await JSON.parse(metadatas[j])
            try {
              const attrs = metadata.attributes.filter(val => {
                if (val.trait_type && val.trait_type === 'Background') {
                  return val
                }
              })
              assert(
                attrs.length == 1,
                'must always contain one, and just one, background attribute'
              )
              assert(
                attrs[0]?.value === "Plain",
                'contains no default background'
              )
            } catch (ex) {
              console.log(`metadata[${j}] => ${ex}\n${await metadatas[j]}`)
              throw ex
            }
          }
        })
        it("metadata contains default object attribute", async () => {
          for (let j = 0; j < metadatas.length; j++) {
            const metadata = await JSON.parse(metadatas[j])
            try {
              const attrs = metadata.attributes.filter(val => {
                if (val.trait_type && val.trait_type === 'Object') {
                  return val
                }
              })
              assert(
                attrs.length == 1,
                'must always contain one, and just one, object attribute'
              )
              assert(
                attrs[0]?.value === "None",
                'contains no default object'
              )
            } catch (ex) {
              console.log(`metadata[${j}] => ${ex}\n${await metadatas[j]}`)
              throw ex
            }
          }
        })
        it("metadata contains non-empty eyes attribute", async () => {
          for (let j = 0; j < metadatas.length; j++) {
            const metadata = await JSON.parse(metadatas[j])
            try {
              const attrs = metadata.attributes.filter(val => {
                if (val.trait_type && val.trait_type === 'Eyes') {
                  return val
                }
              })
              assert(
                attrs.length == 1,
                'must always contain one, and just one, eyes attribute'
              )
              assert(
                attrs[0]?.value.length > 0,
                'contains empty eyes'
              )
            } catch (ex) {
              console.log(`metadata[${j}] => ${ex}\n${await metadatas[j]}`)
              throw ex
            }
          }
        })
        it("metadata contains non-empty head attribute", async () => {
          for (let j = 0; j < metadatas.length; j++) {
            const metadata = await JSON.parse(metadatas[j])
            try {
              const attrs = metadata.attributes.filter(val => {
                if (val.trait_type && val.trait_type === 'Head') {
                  return val
                }
              })
              assert(
                attrs.length == 1,
                'must always contain one, and just one, head attribute'
              )
              assert(
                attrs[0]?.value.length > 0,
                'contains empty head'
              )
            } catch (ex) {
              console.log(`metadata[${j}] => ${ex}\n${await metadatas[j]}`)
              throw ex
            }
          }
        })
        it("metadata contains non-empty mouth attribute", async () => {
          for (let j = 0; j < metadatas.length; j++) {
            const metadata = await JSON.parse(metadatas[j])
            try {
              const attrs = metadata.attributes.filter(val => {
                if (val.trait_type && val.trait_type === 'Mouth') {
                  return val
                }
              })
              assert(
                attrs.length == 1,
                'must always contain one, and just one, mouth attribute'
              )
              assert(
                attrs[0]?.value.length > 0,
                'contains empty mouth'
              )
            } catch (ex) {
              console.log(`metadata[${j}] => ${ex}\n${await metadatas[j]}`)
              throw ex
            }
          }
        })
        it("metadata contains non-empty outfit attribute", async () => {
          for (let j = 0; j < metadatas.length; j++) {
            const metadata = await JSON.parse(metadatas[j])
            try {
              const attrs = metadata.attributes.filter(val => {
                if (val.trait_type && val.trait_type === 'Outfit') {
                  return val
                }
              })
              assert(
                attrs.length == 1,
                'must always contain one, and just one, outfit attribute'
              )
              assert(
                attrs[0]?.value.length > 0,
                'contains empty outfit'
              )
            } catch (ex) {
              console.log(`metadata[${j}] => ${ex}\n${await metadatas[j]}`)
              throw ex
            }
          }
        })
      })
      describe('rare creatures', async () => {
        randomness = "0xc754d49eec4434a3bd789100715ca6a0f7230fe7b66a2cd93457616128bbc5c2"
        before('baseURI()', async () => {
          for (let j = 0; j < 50; j++) {
            metadatas[j] = await decorator.toJSON.call(
              randomness,
              [
                /* name*/ `Name${j}`,
                /* birthTimestamp */ parseInt(Math.floor(Date.now() / 1000)),
                /* globalRanking */ 123 - j,
                /* guildRanking */ 1 + parseInt(Math.random() * 50),
                /* index */ j,
                /* mintUsdCost6 */ 123450000,
                /* rarity */ 1,
                /* score */ 12345 + (50 - j) * 99,
              ]
            )
          }
        })
        it("generates valid JSON", async () => {
          for (let j = 0; j < metadatas.length; j++) {
            try {
              await JSON.parse(metadatas[j])
            } catch (ex) {
              console.log(`metadata[${j}] => ${await metadatas[j]}`)
              throw ex
            }
          }
        })
        it("metadata description contains index", async () => {
          for (let j = 0; j < metadatas.length; j++) {
            const metadata = await JSON.parse(metadatas[j])
            try {
              assert(
                metadata.description.indexOf(j.toString()) >= 0,
                `Token id #${j} not found:\n${await metadatas[j]}`
              )
            } catch (ex) {
              console.log(`metadata[${j}] => ${ex}\n${metadatas[j]}`)
              throw ex
            }
          }
        })
        it("metadata contains default background attribute", async () => {
          for (let j = 0; j < metadatas.length; j++) {
            const metadata = await JSON.parse(metadatas[j])
            try {
              const attrs = metadata.attributes.filter(val => {
                if (val.trait_type && val.trait_type === 'Background') {
                  return val
                }
              })
              assert(
                attrs.length == 1,
                'must always contain one, and just one, background attribute'
              )
              assert(
                attrs[0]?.value === "Plain",
                'contains no default background'
              )
            } catch (ex) {
              console.log(`metadata[${j}] => ${ex}\n${await metadatas[j]}`)
              throw ex
            }
          }
        })
        it("metadata contains special object attribute", async () => {
          for (let j = 0; j < metadatas.length; j++) {
            const metadata = await JSON.parse(metadatas[j])
            try {
              const attrs = metadata.attributes.filter(val => {
                if (val.trait_type && val.trait_type === 'Object') {
                  return val
                }
              })
              assert(
                attrs.length == 1,
                'must always contain one, and just one, object attribute'
              )
              assert(
                attrs[0]?.value.length > 0
                  && attrs[0]?.value !== "None",
                'contains no special rare object'
              )
            } catch (ex) {
              console.log(`metadata[${j}] => ${ex}\n${await metadatas[j]}`)
              throw ex
            }
          }
        })
        it("metadata contains non-empty eyes attribute", async () => {
          for (let j = 0; j < metadatas.length; j++) {
            const metadata = await JSON.parse(metadatas[j])
            try {
              const attrs = metadata.attributes.filter(val => {
                if (val.trait_type && val.trait_type === 'Eyes') {
                  return val
                }
              })
              assert(
                attrs.length == 1,
                'must always contain one, and just one, eyes attribute'
              )
              assert(
                attrs[0]?.value.length > 0,
                'contains empty eyes'
              )
            } catch (ex) {
              console.log(`metadata[${j}] => ${ex}\n${await metadatas[j]}`)
              throw ex
            }
          }
        })
        it("metadata contains non-empty head attribute", async () => {
          for (let j = 0; j < metadatas.length; j++) {
            const metadata = await JSON.parse(metadatas[j])
            try {
              const attrs = metadata.attributes.filter(val => {
                if (val.trait_type && val.trait_type === 'Head') {
                  return val
                }
              })
              assert(
                attrs.length == 1,
                'must always contain one, and just one, head attribute'
              )
              assert(
                attrs[0]?.value.length > 0,
                'contains empty head'
              )
            } catch (ex) {
              console.log(`metadata[${j}] => ${ex}\n${await metadatas[j]}`)
              throw ex
            }
          }
        })
        it("metadata contains non-empty mouth attribute", async () => {
          for (let j = 0; j < metadatas.length; j++) {
            const metadata = await JSON.parse(metadatas[j])
            try {
              const attrs = metadata.attributes.filter(val => {
                if (val.trait_type && val.trait_type === 'Mouth') {
                  return val
                }
              })
              assert(
                attrs.length == 1,
                'must always contain one, and just one, mouth attribute'
              )
              assert(
                attrs[0]?.value.length > 0,
                'contains empty mouth'
              )
            } catch (ex) {
              console.log(`metadata[${j}] => ${ex}\n${await metadatas[j]}`)
              throw ex
            }
          }
        })
        it("metadata contains non-empty outfit attribute", async () => {
          for (let j = 0; j < metadatas.length; j++) {
            const metadata = await JSON.parse(metadatas[j])
            try {
              const attrs = metadata.attributes.filter(val => {
                if (val.trait_type && val.trait_type === 'Outfit') {
                  return val
                }
              })
              assert(
                attrs.length == 1,
                'must always contain one, and just one, outfit attribute'
              )
              assert(
                attrs[0]?.value.length > 0,
                'contains empty outfit'
              )
            } catch (ex) {
              console.log(`metadata[${j}] => ${ex}\n${await metadatas[j]}`)
              throw ex
            }
          }
        })
      })
      describe('legendary creatures', async () => {
        randomness = "0xd754d49eec4434a3bd789100715ca6a0f7230fe7b66a2cd93457616128bbc5c2"
        before('baseURI()', async () => {
          for (let j = 0; j < 50; j++) {
            metadatas[j] = await decorator.toJSON.call(
              randomness,
              [
                /* name*/ `Name${j}`,
                /* birthTimestamp */ parseInt(Math.floor(Date.now() / 1000)),
                /* globalRanking */ 123 - j,
                /* guildRanking */ 1 + parseInt(Math.random() * 50),
                /* index */ j,
                /* mintUsdCost6 */ 123450000,
                /* rarity */ 0,
                /* score */ 12345 + (50 - j) * 99,
              ]
            )
          }
        })
        it("generates valid JSON", async () => {
          for (let j = 0; j < metadatas.length; j++) {
            try {
              await JSON.parse(metadatas[j])
            } catch (ex) {
              console.log(`metadata[${j}] => ${await metadatas[j]}`)
              throw ex
            }
          }
        })
        it("metadata description contains index", async () => {
          for (let j = 0; j < metadatas.length; j++) {
            const metadata = await JSON.parse(metadatas[j])
            try {
              assert(
                metadata.description.indexOf(j.toString()) >= 0,
                `Token id #${j} not found:\n${await metadatas[j]}`
              )
            } catch (ex) {
              console.log(`metadata[${j}] => ${ex}\n${metadatas[j]}`)
              throw ex
            }
          }
        })
        it("metadata contains special background attribute", async () => {
          for (let j = 0; j < metadatas.length; j++) {
            const metadata = await JSON.parse(metadatas[j])
            try {
              const attrs = metadata.attributes.filter(val => {
                if (val.trait_type && val.trait_type === 'Background') {
                  return val
                }
              })
              assert(
                attrs.length == 1,
                'must always contain one, and just one, background attribute'
              )
              assert(
                attrs[0]?.value.length > 0
                  && attrs[0]?.value !== "Plain",
                'contains no special legendary background'
              )
            } catch (ex) {
              console.log(`metadata[${j}] => ${ex}\n${await metadatas[j]}`)
              throw ex
            }
          }
        })
        it("metadata contains special object attribute", async () => {
          for (let j = 0; j < metadatas.length; j++) {
            const metadata = await JSON.parse(metadatas[j])
            try {
              const attrs = metadata.attributes.filter(val => {
                if (val.trait_type && val.trait_type === 'Object') {
                  return val
                }
              })
              assert(
                attrs.length == 1,
                'must always contain one, and just one, object attribute'
              )
              assert(
                attrs[0]?.value.length > 0
                  && attrs[0]?.value !== "None",
                'contains no special legendary object'
              )
            } catch (ex) {
              console.log(`metadata[${j}] => ${ex}\n${await metadatas[j]}`)
              throw ex
            }
          }
        })
        it("metadata contains non-empty eyes attribute", async () => {
          for (let j = 0; j < metadatas.length; j++) {
            const metadata = await JSON.parse(metadatas[j])
            try {
              const attrs = metadata.attributes.filter(val => {
                if (val.trait_type && val.trait_type === 'Eyes') {
                  return val
                }
              })
              assert(
                attrs.length == 1,
                'must always contain one, and just one, eyes attribute'
              )
              assert(
                attrs[0]?.value.length > 0,
                'contains empty eyes'
              )
            } catch (ex) {
              console.log(`metadata[${j}] => ${ex}\n${await metadatas[j]}`)
              throw ex
            }
          }
        })
        it("metadata contains non-empty head attribute", async () => {
          for (let j = 0; j < metadatas.length; j++) {
            const metadata = await JSON.parse(metadatas[j])
            try {
              const attrs = metadata.attributes.filter(val => {
                if (val.trait_type && val.trait_type === 'Head') {
                  return val
                }
              })
              assert(
                attrs.length == 1,
                'must always contain one, and just one, head attribute'
              )
              assert(
                attrs[0]?.value.length > 0,
                'contains empty head'
              )
            } catch (ex) {
              console.log(`metadata[${j}] => ${ex}\n${await metadatas[j]}`)
              throw ex
            }
          }
        })
        it("metadata contains non-empty mouth attribute", async () => {
          for (let j = 0; j < metadatas.length; j++) {
            const metadata = await JSON.parse(metadatas[j])
            try {
              const attrs = metadata.attributes.filter(val => {
                if (val.trait_type && val.trait_type === 'Mouth') {
                  return val
                }
              })
              assert(
                attrs.length == 1,
                'must always contain one, and just one, mouth attribute'
              )
              assert(
                attrs[0]?.value.length > 0,
                'contains empty mouth'
              )
            } catch (ex) {
              console.log(`metadata[${j}] => ${ex}\n${await metadatas[j]}`)
              throw ex
            }
          }
        })
        it("metadata contains non-empty outfit attribute", async () => {
          for (let j = 0; j < metadatas.length; j++) {
            const metadata = await JSON.parse(metadatas[j])
            try {
              const attrs = metadata.attributes.filter(val => {
                if (val.trait_type && val.trait_type === 'Outfit') {
                  return val
                }
              })
              assert(
                attrs.length == 1,
                'must always contain one, and just one, outfit attribute'
              )
              assert(
                attrs[0]?.value.length > 0,
                'contains empty outfit'
              )
            } catch (ex) {
              console.log(`metadata[${j}] => ${ex}\n${await metadatas[j]}`)
              throw ex
            }
          }
        })
      })
    })
  })
})
