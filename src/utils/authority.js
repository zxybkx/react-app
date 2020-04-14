// use localStorage to store the authority info, which might be sent from server in actual project.
import Session from './session';

export function getAuthority() {
  // const session =  Session.get();
  return "ROLE_USER";
  // return session && session.roles ? session.roles.join(',') : '';
}
