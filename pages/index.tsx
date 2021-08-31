import React, { useEffect, useState } from 'react'
import { Gallery, GalleryTile } from '../components/gallery'
import { initWeb3 } from '../lib/web3'

const artist = {
  userName: 'Van Gogh',
  address: '0x13bAf63e9aDFe831b3B9c66f5bC47c9df819B393',
  galleries: [
    {
      name: 'Blue Period',
      address: '0xbd15647aDC66ea9cfF1C74E17a5914D0eb63d3bF',
      images: ['./blue1.jpeg', './blue2.jpeg', './blue3.jpeg'],
    },
  ],
}

export const Home = (): JSX.Element => {
  const [api, setApi] = useState(undefined)

  useEffect(() => {
    if (!api) {
      initWeb3(setApi)
    }
  }, [])

  if (!api) return <h1> loading </h1>

  return (
    <main>
      <h1 className="title">Web3Modal Example</h1>
      {api && (
        <>
          {artist.galleries.map((gallery: Gallery) => (
            <GalleryTile key={gallery.address} gallery={gallery} api={api} />
          ))}
        </>
      )}
    </main>
  )
}

export default Home
