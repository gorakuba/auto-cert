import { CertificateGenerator } from './containers/'

function App() {
  return (
    <main className='flex flex-col gap-y-20 md:gap-y-32 h-screen min-h-screen overflow-y-auto overscroll-y-contain'>
      <CertificateGenerator />
    </main>
  )
}

export default App
