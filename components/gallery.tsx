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
  const hasPaid = false
  return (
    <div>
      <h3>{name}</h3>
      {images.map((i: string) => (
        <img key={i} src={hasPaid ? i : './gallery_placeholder.png'}></img>
      ))}
      <style jsx>{`
        img {
          max-width: 200px;
        }
      `}</style>
      <button
        className="button"
        type="button"
        onClick={async () => {
          await api.attemptPurchase(address, gallery.price)
        }}
      >
        Send Funds
      </button>
    </div>
  )
}
