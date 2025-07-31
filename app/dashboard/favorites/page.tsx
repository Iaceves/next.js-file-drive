import React from 'react'
import { FileBrowser } from '../_components/file-browser'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'

export default function FavoritesPage() {
  // const files = useQuery(api.file.getFiles, { 
  //   favorites: true,
  //   query: "",
  // }) 

  return (
    <div>
      <FileBrowser title={"Favorites"} favorites />
    </div>
  )
}

