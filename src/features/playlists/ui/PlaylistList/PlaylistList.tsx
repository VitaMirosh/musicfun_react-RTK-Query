import s from '@/features/playlists/ui/PlaylistsPage.module.css'
import { EditPlaylistForm } from '@/features/playlists/ui/EditPlaylistForm/EditPlaylistForm.tsx'
import { PlaylistItem } from '@/features/playlists/ui/PlaylistItem/PlaylistItem.tsx'
import { useForm } from 'react-hook-form'
import type { PlaylistData, UpdatePlaylistArgs } from '@/features/playlists/api/playlistsApi.types.ts'
import { useDeletePlaylistMutation } from '@/features/playlists/api/playlistsApi.ts'
import { useState } from 'react'

type Props={
playlists:PlaylistData[]
  isPlaylistLoading: boolean
}

export const PlaylistList = ({playlists,isPlaylistLoading}:Props) => {
  const { register, handleSubmit, reset } = useForm<UpdatePlaylistArgs>()

  const [playlistId, setPlaylistId] = useState<string | null>(null)
  const [deletePlaylist] = useDeletePlaylistMutation()

  const editPlaylistHandler = (playlist: PlaylistData | null) => {
    if (playlist) {
      setPlaylistId(playlistId)
      reset({
        title: playlist.attributes.title,
        description: playlist.attributes.description,
        tagIds: playlist.attributes.tags.map((tag) => tag.id),
      })
    } else {
      setPlaylistId(null)
    }
  }

  const deletePlaylistHandler = (playlistId: string) => {
    if (confirm('Are you sure you want to delete the playlist?')) {
      deletePlaylist(playlistId)
    }
  }
  return (
    <div className={s.items}>
      {!playlists.length && isPlaylistLoading&& <h2>Playlists not found</h2>}
      {playlists.map((playlist) => {
        const isEditing = playlist.id === playlistId

        return (
          <div className={s.item} key={playlist.id}>
            {isEditing ? (
              <EditPlaylistForm
                playlistId={playlistId}
                setPlaylistId={setPlaylistId}
                editPlaylist={editPlaylistHandler}
                register={register}
                handleSubmit={handleSubmit}
              />
            ) : (
              <PlaylistItem
                playlist={playlist}
                deletePlaylistHandler={deletePlaylistHandler}
                editPlaylistHandler={editPlaylistHandler}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}