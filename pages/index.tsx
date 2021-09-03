import React, { useEffect, useState } from 'react'
import { Gallery, GalleryTile } from '../components/gallery'
import { initWeb3 } from '../lib/web3'

const artist = {
  userName: 'Van Gogh',
  address: '0x13bAf63e9aDFe831b3B9c66f5bC47c9df819B393',
  galleries: [
    {
      name: 'Blue Period',
      address: '0x465f0Ba1BB3596Bc192Df886fbe139Df29017964',
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
    <main className="flex flex-col items-center m-auto">
      <h1 className="text-5xl pb-10">{`${artist.userName}'s Gallery`}</h1>
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
