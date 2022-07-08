# Witty Creatures v3.0

## Deployer's manual
- Make sure Witnet network settings and address have been imported correctly within `node_modules/witnet-solidity-bridge/migrations/`
- Before deploying, review settings file at `migrations/settings.js`:
  - Common params:
    - ***baseURI**: must end with slash.*
    - ***colors**: as many as produced, in the same order as interpreted from UI.*
    - ***expirationBlocks**: number of blocks after randomness is requested during which minting can happen; 0 implies that there will be no expiration deadline.*
    - ***percentiles**: array containing cumulative percentile values that will determine eggs rarity index, standing the first value for the Legendary kind, the second for Rare kind and the last for Common kind; values must sum up to 100.*
    ***signator**: ECDSA public address of the private key used in backend for producing minting signatures; if not set, deployer address will be initially set as signator.*
    ***totalEggs**: total production number of physical eggs (used only for global ranking formal verification).*
  - Guild specific params: 
    - ***guild**: guild name is we want it to appear within token metadata.*
    - ***mintGasOverhead**: uncomputable overhead gas units used for self-estimating minting cost in US dollars.*
    - ***usdPriceCaption**: currency pair to be used for estimating minting cost in US dollars.*
    - **traitTags**:
      - ***backgrounds**: non-default background tags.*
      - ***eyes**: non-default eyes tags.*
      - ***heads**: non-default head tags.*
      - ***mouths**: non-default mouth tags.*
      - ***objects**: non-default object tags.*
      - ***outfits**: non-default object tags.*
    > Please, note:
    > - Values defined within "specs/default" will apply the same to all guilds. 
    > - Values defined within specific guilds will default values in all params but "traitTags".
    > - Guilds may specify additional trait tags to those specified in "specs/default".
- Deploy from CLI:
  $ truffle migrate --network <chain>.<network>
  > Please. note:
  > - Use <chain>.<network> as named in `node_modules/witnet-solidity-bridge/migrations/settings.js#networks`.
  > - Make sure you have the corresponding RPC gateway listening in the corresponding local port.
  > - Two contracts will be deployed: `Wc3Token` and `Wc3Decorator`. Deployed addresses will be automatically written to `migrations/addresses.json`
- You can reforce redeployment of any of these two contracts by deleting the corresponding address in `migrations/addresses.json` and running truffle again.  

## Owner's manual
- On `Wc3Decorator`:
  - You may modify the baseURI by calling to `setBaseURI` at any time.
  - You may modify tags by using the `set*Tags(string[])` methods, as long as the contract is not "forged".
  - You can verify current tags by calling to `get*()` getter methods. 
  - You can "forge" the contract, just once, by calling to the `forge()` methods. Forging will only be possible if all traits have at least one tag.
- On `Wc3Token`:
  - You may change the decorator contract that's used for both minting and preview operations, as long as the contract is in "Batching" status. 
  - You may modify basic settings by calling to `setSettings(.)`, as long as the contract is in "Batching" status.
  - You can change signator address at any time.
  - You can modify the gas overhead used for self-estimating the minting USD cost by calling to `setMintGasOverhead` at any time.
  - For the minting to be possible the contract must be randomized first. For this to happen you need to call to `startHatching() payable` and pay enough funds as to cover the randomization fee required by the "WitnetRandomness" oracle (ie. `randomizer()`). Randomization is an asynchronous process that use to take around 5-10 minutes. While randomness is being solved, the contract will remain in "Randomizing" status, passing automatically to "Hatching" status as soon as the randomness is served from the Witnet side-chain.
  - Before calling to `startHatching() payable`, though:
    - Underlying Wc3Decorator contract (ie. `decorator()`) must be forged first.
    - Double-check `getSettings()` are final, as it won't be possible to change them once randomization starts. 


  