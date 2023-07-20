import { AuthService} from './AuthService'
import Cookies from 'js-cookie'

export const userLogin =() =>{
  const authService = new AuthService("http://localhost:9091/api");
const login =async (username: string, password: string) =>{
  const user = await authService.login(username, password);
  if (user) {
    Cookies.set("currentUser",JSON.stringify(user));
  }

  return user as User ;
}

return { login} ;
}
