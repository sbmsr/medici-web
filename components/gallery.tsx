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
  const [price, setPrice] = useState('')

  useEffect(() => {
    const detectHasPaid = async () =>
      setHasPaid(await api.detectHasPaid(gallery.address))
    const getPrice = async () =>
      setPrice(await api.getPriceString(gallery.address))

    if (hasPaid === false) {
      detectHasPaid()
    }

    if (!price) {
      getPrice()
    }
  }, [])

  return (
    <div className="max-w-sm flex flex-col">
      <h3 className="text-2xl py-2">{name}</h3>
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
          <p className="text-2xl py-2 text-center">{`${gallery.images.length} Images`}</p>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-auto"
            type="button"
            onClick={async () => {
              await api.attemptPurchase(address)
            }}
          >
            {`Purchase for Ξ ${price}`}
          </button>
        </>
      )}
      <style global jsx>
        {`
          .slick-prev:before,
          .slick-next:before {
            color: red;
          }
        `}
      </style>
    </div>
  )
}
