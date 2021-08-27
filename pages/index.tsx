import React, { useEffect, useState } from 'react'
import { Gallery, GalleryTile } from '../components/gallery'
import { initWeb3 } from '../lib/web3'

const artist = {
  userName: 'Van Gogh',
  address: '0x5c611cb1afd116e0bf40aa00297688d2f8e6c9c2',
  galleries: [
    {
      name: 'Blue Period',
      address: '0x36Ff249bCa4B82e99c5227337AEb87B0591E160f',
      images: ['./blue.jpeg'],
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
