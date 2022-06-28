export const CONTRACT_ADDRESS =
  import.meta.env.VITE_CONTRACT_ADDRESS ||
  '0xE41D6D1cFe55A0fc2035dD663D873D15f21d93c2'

export const OPENSEA_BASE_URL =
  import.meta.env.VITE_OPENSEA_BASE_URL ||
  'https://opensea.io/assets/0x855BCa56D00F3f550D0c610BBF562FEBF6540bc6'

export const EXPLORER_BASE_URL =
  import.meta.env.VITE_EXPLORER_BASE_URL || 'https://polygonscan.com/tx/'

export const NETWORK = import.meta.env.VITE_NETWORK || 137

export const VITE_TEST = import.meta.env.VITE_TEST || false

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://0.0.0.0:4000'

export const BASE_URL =
  import.meta.env.VITE_BASE_URL || 'https://bufficorns.com'

export const ATTRIBUTES = {}

export const STATS_FILTERS = {
  global: {
    key: 'global',
    active: false,
    showSubtabs: false,
  },
  network: {
    key: 'network',
    active: false,
    showSubtabs: false,
  },
}

export const THEME_COLORS = {
  0: 'green',
  1: 'black',
  2: 'red',
  3: 'purple',
  4: 'white',
  5: 'yellow',
  6: 'blue',
}

export const NETWORKS = {
  1: {
    name: 'Ethereum Mainnet',
    id: '1',
    kind: 'ethereans',
    contractAddress: import.meta.env.VITE_ETHEREUM_CONTRACT_ADDRESS,
    rpcUrls: ['https://mainnet.infura.io/v3/'],
    blockExplorerUrls: ['https://etherscan.io/'],
  },
  288: {
    name: 'Boba Network',
    id: '288',
    kind: 'bobarians',
    contractAddress: import.meta.env.VITE_BOBA_CONTRACT_ADDRESS,
    rpcUrls: ['https://mainnet.boba.network'],
    blockExplorerUrls: ['https://blockexplorer.boba.network/'],
  },
  321: {
    name: 'KCC Mainnet',
    id: '321',
    kind: 'moonbeam',
    contractAddress: import.meta.env.VITE_MOONBEAM_CONTRACT_ADDRESS,
    rpcUrls: ['https://rpc-mainnet.kcc.network'],
    blockExplorerUrls: ['https://explorer.kcc.io/'],
  },
  66: {
    name: 'OKX Chain',
    id: '66',
    kind: 'okx',
    contractAddress: import.meta.env.VITE_OKX_CONTRACT_ADDRESS,
    rpcUrls: ['https://exchainrpc.okex.org'],
    blockExplorerUrls: [''],
  },
  1088: {
    name: 'Metis Mainnet',
    id: '1088',
    kind: 'metis',
    contractAddress: import.meta.env.VITE_METIS_CONTRACT_ADDRESS,
    rpcUrls: ['https://andromeda.metis.io/?owner=1088'],
    blockExplorerUrls: ['https://andromeda-explorer.metis.io/'],
  },
  137: {
    name: 'Polygon Mainnet',
    id: 137,
    kind: 'polygon',
    contractAddress: import.meta.env.VITE_POLYGON_CONTRACT_ADDRESS,
    rpcUrls: ['https://polygon-rpc.com/'],
    blockExplorerUrls: ['https://polygonscan.com'],
  },
}

export const POLLER_MILLISECONDS = import.meta.env.VITE_POLLER_MILLISECONDS
  ? parseInt(import.meta.env.VITE_POLLER_MILLISECONDS)
  : 5000

export const TIME_TO_MINT_MILLISECONDS = import.meta.env
  .VITE_TIME_TO_MINT_MILLISECONDS
  ? parseInt(import.meta.env.VITE_TIME_TO_MINT_MILLISECONDS)
  : 60000

export const DEMO_ENDS_TIMESTAMP = import.meta.env.VITE_DEMO_ENDS_TIMESTAMP
  ? parseInt(import.meta.env.VITE_DEMO_ENDS_TIMESTAMP)
  : 1658241429000 // Tue Jul 19 2022 16:37:09 GMT+0200 (Central European Summer Time)

export const GAME_ENDS_TIMESTAMP = import.meta.env.VITE_GAME_ENDS_TIMESTAMP
  ? parseInt(import.meta.env.VITE_GAME_ENDS_TIMESTAMP)
  : 1658241429000 // Tue Jul 19 2022 16:37:09 GMT+0200 (Central European Summer Time)

export const PLAYER_MAINNET_TIMESTAMP = import.meta.env.PLAYER_MAINNET_TIMESTAMP
  ? parseInt(import.meta.env.VITE_PLAYER_MAINNET_TIMESTAMP)
  : 1658241429000 // Tue Jul 19 2022 16:37:09 GMT+0200 (Central European Summer Time)
