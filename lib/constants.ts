import { AbiItem } from 'web3-utils'

export const mediciABI: AbiItem[] = [
  {
    inputs: [{ internalType: 'uint256', name: 'p', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'address', name: '', type: 'address' },
    ],
    name: 'paymentSuccessful',
    type: 'event',
  },
  {
    inputs: [],
    name: 'blockNumber',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [],
    name: 'price',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [],
    name: 'attemptPurchase',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
    payable: true,
  },
  {
    inputs: [],
    name: 'destroy',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]
