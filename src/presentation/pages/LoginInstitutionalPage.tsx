import LoginInstitutional from '../components/LoginInstitutional'
// import { UserRepository } from '../../infrastructure/repositories/UserRepository' // prepared for future
// import { LoginUser } from '../../domain/usecases/LoginUser' // prepared for future
// import { useNavigate } from 'react-router-dom' // navigation will be handled in container


export default function LoginInstitutionalPage() {
  // Repository and usecase are prepared for future backend integration
  // const repo = new UserRepository()
  // const loginUseCase = new LoginUser(repo)

  async function handleOAuth() {
    // Placeholder: when backend exists call loginUseCase and handle result.
    console.log('onOAuth called — implement backend call in the future')
  }

  return <LoginInstitutional onOAuth={handleOAuth} />
}
