

import s from './App.module.css'

import { Header, LinearProgress } from '@/common/components'
import { Routing } from '@/common/routing'
import { ToastContainer } from 'react-toastify'
import { useGlobalLoading } from '@/common/hooks'



export const App = () => {
  const isGlobalLouding = useGlobalLoading()
  return (
    <>
      <Header />
      {isGlobalLouding && <LinearProgress/>}
      <div className={s.layout}>
        <Routing />
      </div>
      <ToastContainer/>
    </>
  )
}
export default App
