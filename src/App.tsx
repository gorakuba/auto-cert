import { CertificateGenerator } from './containers/'
import { ThemeProvider } from './contexts'
import { MainLayout } from './layouts'

function App() {
  return (
    <ThemeProvider>
      <MainLayout title='Home'>
        <CertificateGenerator />
      </MainLayout>
    </ThemeProvider>
  )
}

export default App
