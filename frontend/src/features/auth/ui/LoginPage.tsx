import LoginInstitutional from './LoginInstitutional'

export default function LoginPage() {
  async function handleOAuth() {
    console.log('onOAuth called — implement backend call in the future')
  }
  return <LoginInstitutional onOAuth={handleOAuth} />
}
