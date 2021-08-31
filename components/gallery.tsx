import { useEffect, useState } from 'react'
import Slider from 'react-slick'
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

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
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
    <div className="galleryTile">
      <h3>{name}</h3>
      {hasPaid ? (
        <>
          <Slider {...settings}>
            {images.map((i: string) => (
              <img
                onContextMenu={(e) => e.preventDefault()}
                key={i}
                src={i}
              ></img>
            ))}
          </Slider>
        </>
      ) : (
        <>
          <img src={'./gallery_placeholder.png'}></img>
          <button
            className="button"
            type="button"
            onClick={async () => {
              await api.attemptPurchase(address)
            }}
          >
            Send Funds
          </button>
        </>
      )}
      <style global jsx>
        {`
          .galleryTile {
            max-width: 400px;
            margin: 0 auto;
          }
          .slick-prev:before,
          .slick-next:before {
            color: red;
          }
        `}
      </style>
    </div>
  )
}
