import { Dispatch, SetStateAction } from 'react'
import Web3 from 'web3'
import { TransactionReceipt } from 'web3-eth'
import { AbiItem } from 'web3-utils'
import Web3Modal from 'web3modal'

export const initWeb3 = async (
  setWeb3: Dispatch<SetStateAction<Web3>>,
  setWeb3Modal: Dispatch<SetStateAction<Web3Modal>>
): Promise<void> => {
  if (typeof window !== 'undefined') {
    const web3Modal = new Web3Modal({
      providerOptions: {}, // required
    })
    setWeb3Modal(web3Modal)

    const modalProvider = await web3Modal.connect()
    const web3Provider = new Web3(modalProvider)
    setWeb3(web3Provider)
  }
}

export const attemptPurchase = async (
  web3Modal: Web3Modal,
  provider: Web3
): Promise<TransactionReceipt | void> => {
  const Medici = new provider.eth.Contract(
    [
      {
        inputs: [[Object]],
        stateMutability: 'nonpayable',
        type: 'constructor',
        constant: undefined,
        payable: undefined,
      },
      {
        anonymous: false,
        inputs: [[Object]],
        name: 'paymentSuccessful',
        type: 'event',
        constant: undefined,
        payable: undefined,
      },
      {
        inputs: [],
        name: 'price',
        outputs: [[Object]],
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
        constant: undefined,
      },
      {
        inputs: [],
        name: 'destroy',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
        constant: undefined,
        payable: undefined,
      },
    ] as AbiItem[],
    '0x36Ff249bCa4B82e99c5227337AEb87B0591E160f' //TODO: Need to dynamically get contract address.
  )

  const fromAddress = (await provider.eth.getAccounts())[0]
  if (!fromAddress) {
    return alert(`Unable to retrieve your address`)
  }

  try {
    return await Medici.methods.attemptPurchase().send({
      from: fromAddress,
      to: '0x36Ff249bCa4B82e99c5227337AEb87B0591E160f',
      value: provider.utils.toWei('.01'),
    })
  } catch (e: any) {
    if (typeof e !== 'string') {
      return alert(JSON.stringify(e))
    }
    return alert(e)
  }
}
