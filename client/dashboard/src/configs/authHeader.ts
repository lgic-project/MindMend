
import Cookies from 'js-cookie'

export default function authHeader(): { [key: string]: string | null } {
  const currentUser = Cookies.get("currentUser");
  let user: { accessToken?: string } | null = null;

  if (currentUser) {
    user = JSON.parse(currentUser);
  }

  if (user && user.accessToken) {
    return { 'x-access-token': user.accessToken };
  } else {
    return { 'x-access-token': null };
  }
}
