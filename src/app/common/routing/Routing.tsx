import { Route, Routes } from 'react-router'
import { MainPage } from '@/app/ui/MainPage/MainPage.tsx'
import { PlaylistsPage } from '@/app/features/playlists/ui/PlaylistsPage.tsx'
import { TracksPage } from '@/app/features/tracks/ui/TracksPage.tsx'
import { ProfilePage } from '@/app/features/auth/ui/ProfilePage/ProfilePage.tsx'
import { PageNotFound } from '@/app/common/components'


export const Path = {
  Main: '/',
  Playlists: '/playlists',
  Tracks: '/tracks',
  Profile: '/profile',
  NotFound: '*',
} as const

export const Routing = () => (
  <Routes>
    <Route path={Path.Main} element={<MainPage />} />
    <Route path={Path.Playlists} element={<PlaylistsPage />} />
    <Route path={Path.Tracks} element={<TracksPage />} />
    <Route path={Path.Profile} element={<ProfilePage />} />
    <Route path={Path.NotFound} element={<PageNotFound />} />
  </Routes>
)