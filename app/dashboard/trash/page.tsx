import React from 'react'
import { FileBrowser } from '../_components/file-browser'


export default function DeletePage() { 

  return (
    <div>
      <FileBrowser title="Delete" deletedOnly />
    </div>
  )
}
