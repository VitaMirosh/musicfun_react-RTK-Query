
import { Header } from '@/app/common/components'
import s from './App.module.css'
import { Routing } from '@/app/common/routing'

export const App = () => {
  return (
    <>
      <Header />
      <div className={s.layout}>
        <Routing />
      </div>
    </>
  )
}
export default App
