import type { ChangeEvent } from 'react'
import {
  useDeletePlaylistCoverMutation,
  useUploadPlaylistCoverMutation,
} from '@/features/playlists/api/playlistsApi.ts'
import defaultCover from '@/assets/img/default-playlist-cover.png'
import type { Images } from '@/common/types'
import s from './PlaylistItem.module.css'
import { errorToast } from '@/common/utils'


type Props = {
  playlistId: string
  images: Images
}

export const PlaylistCover = ({ playlistId, images }: Props) => {
  const [uploadPlaylistCover] = useUploadPlaylistCoverMutation()
  const [deletePlaylistCover] = useDeletePlaylistCoverMutation()

  const originalCover = images.main.find((img) => img.type === 'original')
  const src = originalCover ? originalCover.url : defaultCover

  const uploadPlaylistCoverHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const maxSize = 1024 * 1024 // 1MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']

    const file = event.target.files?.length && event.target.files[0]
    if (!file) return
    if (!allowedTypes.includes(file.type)) {
      errorToast('Only JPEG,PNG or GIF images allowed!')
      return
    }
    if (file.size > maxSize) {
      errorToast(`The file is too large. Max size is ${Math.round(maxSize / 1024)} KB`)
      return
    }
    uploadPlaylistCover({
      playlistId: playlistId,
      file,
    })
  }

  const deleteCoverHandler = () => {
    deletePlaylistCover({ playlistId })
  }
  return (
    <>
      <img src={src} alt="cover" width={'240px'} className={s.cover} />
      <input type="file" accept={'image/jpeg, image/png, image/gif'} onChange={uploadPlaylistCoverHandler} />
      {originalCover && <button onClick={deleteCoverHandler}>delete cover </button>}
    </>
  )
}
