import { CertificateProvider, useCertificateContext } from '../../contexts'
import { Editor } from './Editor'
import { Uploader } from './Uploader'

const CertificateView = () => {
  const { generated } = useCertificateContext()

  if (generated) {
    return <Editor />
  }

  return <Uploader />
}

export const CertificateGenerator = () => (
  <CertificateProvider>
    <CertificateView />
  </CertificateProvider>
)
