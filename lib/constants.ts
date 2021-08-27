import { AbiItem } from 'web3-utils'

export const mediciABI: AbiItem[] = [
  {
    anonymous: false,
    inputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
        indexed: false,
      },
    ],
    name: 'paymentSuccessful',
    type: 'event',
    constant: undefined,
    payable: undefined,
  },
  {
    inputs: [],
    name: 'price',
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
    payable: undefined,
  },
  {
    inputs: [],
    name: 'attemptPurchase',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
    payable: true,
  },
]
