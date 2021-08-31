import { useEffect, useState } from 'react'
import { MediciAPI } from '../lib/web3'

export interface Artist {
  userName: string
  address: string
  galleries: Gallery[]
}

export interface Gallery {
  name: string
  address: string
  images: string[]
  price: string
}

export const GalleryTile = ({
  gallery,
  api,
}: {
  gallery: Gallery
  api: MediciAPI
}): JSX.Element => {
  const { name, address, images } = gallery
  const [hasPaid, setHasPaid] = useState(false)

  useEffect(() => {
    const detectHasPaid = async () =>
      setHasPaid(await api.detectHasPaid(gallery.address))

    if (hasPaid === false) {
      detectHasPaid()
    }
  }, [])

  return (
    <div>
      <h3>{name}</h3>
      {images.map((i: string) => (
        <img
          onContextMenu={(e) => e.preventDefault()}
          key={i}
          src={hasPaid ? i : './gallery_placeholder.png'}
        ></img>
      ))}
      <style jsx>{`
        img {
          max-width: 200px;
        }
      `}</style>
      {hasPaid || (
        <button
          className="button"
          type="button"
          onClick={async () => {
            await api.attemptPurchase(address)
          }}
        >
          Send Funds
        </button>
      )}
    </div>
  )
}
