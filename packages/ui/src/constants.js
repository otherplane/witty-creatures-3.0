export const CONTRACT_ADDRESS =
  import.meta.env.VITE_CONTRACT_ADDRESS ||
  '0xE41D6D1cFe55A0fc2035dD663D873D15f21d93c2'

export const OPENSEA_BASE_URL =
  import.meta.env.VITE_OPENSEA_BASE_URL ||
  'https://opensea.io/assets/0x855BCa56D00F3f550D0c610BBF562FEBF6540bc6'

export const VITE_TEST = import.meta.env.VITE_TEST || false

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://0.0.0.0:4000'

export const BASE_URL =
  import.meta.env.VITE_BASE_URL || 'https://wittycreatures.com/'

export const ATTRIBUTES = {}

export const THEME_COLORS = {
  0: 'green',
  1: 'black',
  2: 'red',
  3: 'yellow',
  4: 'blue',
}

export const TOKEN_STATUS = {
  inexistent: 0,
  incubating: 1,
  randomizing: 2,
  hatching: 3,
  minted: 4,
  frozen: 5,
}

export const MAINNET_NETWORKS = {
  1030: {
    name: 'Conflux eSpace Mainnet',
    id: 1030,
    kind: 'confi',
    contractAddress:
      import.meta.env.VITE_CONFLUX_ESPACE_MAINNET_CONTRACT_ADDRESS || '0x00',
    rpcUrls: ['https://evm.confluxrpc.com'],
    blockExplorerUrls: ['https://www.confluxscan.io/'],
    marketplace: '',
    marketplaceName: '',
    confirmationCount: 3,
  },
  25: {
    name: 'Cronos Mainnet',
    id: 25,
    kind: 'cronian',
    contractAddress:
      import.meta.env.VITE_CRONOS_MAINNET_CONTRACT_ADDRESS || '0x00',
    rpcUrls: ['https://cronosrpc-1.xstaking.sg'],
    blockExplorerUrls: ['https://cronoscan.com/'],
    marketplace: 'https://tofunft.com/nft/cronos',
    marketplaceName: 'TofuNFT',
    confirmationCount: 3,
  },
  321: {
    name: 'KCC Mainnet',
    id: '321',
    kind: 'kucoiner',
    contractAddress: import.meta.env.VITE_KCC_MAINNET_CONTRACT_ADDRESS,
    rpcUrls: ['https://rpc-mainnet.kcc.network'],
    blockExplorerUrls: ['https://explorer.kcc.io/'],
    marketplace: 'https://nft.kuswap.finance/#/nfts/collections',
    marketplaceName: 'TofuNFT',
    confirmationCount: 3,
  },
  1: {
    name: 'Ethereum Mainnet',
    id: '1',
    kind: 'etherean',
    contractAddress: import.meta.env.VITE_ETHEREUM_MAINNET_CONTRACT_ADDRESS,
    rpcUrls: ['https://eth-mainnet.public.blastapi.io'],
    blockExplorerUrls: ['https://etherscan.io/'],
    marketplace: 'https://opensea.io/assets/ethereum',
    marketplaceName: 'OpenSea',
    confirmationCount: 3,
  },
  82: {
    name: 'Meter Mainnet',
    id: 82,
    kind: 'meterean',
    contractAddress:
      import.meta.env.VITE_METER_MAINNET_CONTRACT_ADDRESS || '0x00',
    rpcUrls: ['https://rpc.meter.io'],
    blockExplorerUrls: ['https://scan.meter.io/'],
    marketplace: 'https://tofunft.com/nft/meter',
    marketplaceName: 'TofuNFT',
    confirmationCount: 3,
  },
  1088: {
    name: 'Metis Mainnet',
    id: 1088,
    kind: 'metisian',
    contractAddress: import.meta.env.VITE_METIS_MAINNET_CONTRACT_ADDRESS,
    rpcUrls: ['https://andromeda.metis.io/?owner=1088'],
    blockExplorerUrls: ['https://andromeda-explorer.metis.io/'],
    marketplace: 'https://tofunft.com/nft/metis',
    marketplaceName: 'TofuNFT',
    confirmationCount: 3,
  },
  66: {
    name: 'OKXChain Mainnet',
    id: 66,
    kind: 'okchainner',
    contractAddress: import.meta.env.VITE_OKXCHAIN_MAINNET_CONTRACT_ADDRESS,
    rpcUrls: ['https://exchainrpc.okex.org'],
    blockExplorerUrls: ['https://www.oklink.com/en/okc'],
    marketplace: 'https://tofunft.com/nft/oec',
    marketplaceName: 'TofuNFT',
    confirmationCount: 3,
  },
  137: {
    name: 'Polygon Mainnet',
    id: 137,
    kind: 'polygonian',
    contractAddress: import.meta.env.VITE_POLYGON_MAINNET_CONTRACT_ADDRESS,
    rpcUrls: ['https://polygon-rpc.com/'],
    blockExplorerUrls: ['https://polygonscan.com'],
    marketplace: 'https://opensea.io/assets/matic',
    marketplaceName: 'OpenSea',
    confirmationCount: 3,
  },
}

export const TESTNET_NETWORKS = {
  71: {
    name: 'Conflux eSpace Testnet',
    id: 71,
    kind: 'confi',
    contractAddress:
      import.meta.env.VITE_CONFLUX_ESPACE_TESTNET_CONTRACT_ADDRESS || '0x00',
    rpcUrls: ['https://evmtestnet.confluxrpc.com'],
    blockExplorerUrls: ['https://testnet.confluxscan.io/'],
    marketplace: '',
    marketplaceName: '',
    confirmationCount: 3,
  },
  338: {
    name: 'Cronos Testnet',
    id: 338,
    kind: 'cronian',
    contractAddress:
      import.meta.env.VITE_CRONOS_TESTNET_CONTRACT_ADDRESS || '0x00',
    rpcUrls: ['https://evm-t3.cronos.org'],
    blockExplorerUrls: ['https://testnet.cronoscan.com/'],
    marketplace: 'https://tofunft.com/nft/cronos',
    marketplaceName: 'TofuNFT',
    confirmationCount: 3,
  },
  322: {
    name: 'KCC Testnet',
    id: 322,
    kind: 'kucoiner',
    contractAddress:
      import.meta.env.VITE_KCC_TESTNET_CONTRACT_ADDRESS || '0x00',
    rpcUrls: ['https://rpc-testnet.kcc.network'],
    blockExplorerUrls: ['https://scan-testnet.kcc.network/'],
    marketplace: 'https://nft.kuswap.finance/#/nfts/collections',
    marketplaceName: 'TofuNFT',
    confirmationCount: 3,
  },
  4: {
    name: 'Ethereum Rinkeby',
    id: 4,
    kind: 'etherean',
    contractAddress:
      import.meta.env.VITE_ETHEREUM_RINKEBY_CONTRACT_ADDRESS || '0x00',
    rpcUrls: ['https://rpc.ankr.com/eth_rinkeby'],
    blockExplorerUrls: ['https://rinkeby.etherscan.io/'],
    marketplace: 'https://testnets.opensea.io/assets/rinkeby',
    marketplaceName: 'OpenSea',
    confirmationCount: 3,
  },
  83: {
    name: 'Meter Testnet',
    id: 83,
    kind: 'meterean',
    contractAddress:
      import.meta.env.VITE_METER_TESTNET_CONTRACT_ADDRESS || '0x00',
    rpcUrls: ['https://rpctest.meter.io'],
    blockExplorerUrls: ['https://scan-warringstakes.meter.io/'],
    marketplace: 'https://tofunft.com/nft/meter',
    marketplaceName: 'TofuNFT',
    confirmationCount: 3,
  },
  588: {
    name: 'Metis Stardust Testnet',
    id: 588,
    kind: 'metisian',
    contractAddress:
      import.meta.env.VITE_METIS_TESTNET_CONTRACT_ADDRESS || '0x00',
    rpcUrls: ['https://stardust.metis.io/?owner=588'],
    blockExplorerUrls: ['https://stardust-explorer.metis.io/'],
    marketplace: 'https://tofunft.com/nft/metis',
    marketplaceName: 'TofuNFT',
    confirmationCount: 3,
  },
  65: {
    name: 'OKXChain Testnet',
    id: 65,
    kind: 'okchainner',
    contractAddress:
      import.meta.env.VITE_OKXCHAIN_TESTNET_CONTRACT_ADDRESS || '0x00',
    rpcUrls: ['exchaintestrpc.okex.org'],
    blockExplorerUrls: ['oklink.com/okc-test/'],
    marketplace: 'https://tofunft.com/nft/oec',
    marketplaceName: 'TofuNFT',
    confirmationCount: 3,
  },
  80001: {
    name: 'Polygon Mumbai',
    id: 80001,
    kind: 'polygonian',
    contractAddress: import.meta.env.VITE_POLYGON_MUMBAI_CONTRACT_ADDRESS,
    rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
    blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
    marketplace: 'https://testnets.opensea.io/assets/mumbai',
    marketplaceName: 'OpenSea',
    confirmationCount: 3,
  },
}

export const NETWORKS =
  import.meta.env.VITE_ALLOW_TEST_NETWORKS &&
  Number(import.meta.env.VITE_ALLOW_TEST_NETWORKS)
    ? { ...MAINNET_NETWORKS, ...TESTNET_NETWORKS }
    : MAINNET_NETWORKS

export const POLLER_MILLISECONDS = import.meta.env.VITE_POLLER_MILLISECONDS
  ? parseInt(import.meta.env.VITE_POLLER_MILLISECONDS)
  : 5000

export const TIME_TO_MINT_MILLISECONDS = import.meta.env
  .VITE_TIME_TO_MINT_MILLISECONDS
  ? parseInt(import.meta.env.VITE_TIME_TO_MINT_MILLISECONDS)
  : 60000

export const GAME_ENDS_TIMESTAMP = import.meta.env.VITE_GAME_ENDS_TIMESTAMP
  ? parseInt(import.meta.env.VITE_GAME_ENDS_TIMESTAMP)
  : 1658419200000 // 03/21/2022 18:00:00 GMT+02:00

export const TIMEZONE = 'Europe/Paris'
