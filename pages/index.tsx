import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Gallery, GalleryTile } from '../components/gallery'
import { initWeb3 } from '../lib/web3'

const artist = {
  userName: 'Van Gogh',
  address: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  mediciAddress: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
  galleries: [
    {
      id: '1',
      name: 'Blue Period1',
      images: ['./blue1.jpeg', './blue2.jpeg'],
    },
    {
      id: '2',
      name: 'Blue Period 2',
      images: ['./blue3.jpeg'],
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
    <>
      <nav className="w-full flex flex-row justify-end">
        <Link href="/admin">admin_login</Link>
      </nav>
      <main className="flex flex-col items-center m-auto">
        <h1 className="text-5xl pb-10">{`${artist.userName}'s Gallery`}</h1>
        {api && (
          <>
            {artist.galleries.map((gallery: Gallery) => (
              <GalleryTile
                key={gallery.id}
                address={artist.mediciAddress}
                gallery={gallery}
                api={api}
              />
            ))}
          </>
        )}
      </main>
    </>
  )
}

export default Home
