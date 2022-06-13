import { StateDeclaration, Transition, TransitionService } from '@uirouter/core';
import { AuthService } from 'src/app/commons/services/users/auth.service';
import { User } from '../models/users.model';
import { UserService } from '../services/users/user.service';



const useServices = (t: Transition)=>{
  return { 
      auth: t.injector().get(AuthService) as AuthService, 
      state: t.router.stateService,
      user: t.injector().get(UserService) as UserService, 
    };
}
const redirectDependOnType = (u: User,t: Transition): any =>{
  const {state } = useServices(t);
  const to = t.to()
  if (!to.name?.startsWith(u.type)) {
    state.go(to.name?.replace(/^\w+-/,u.type + '-') || `${u.type}-dashboard`,to.params,{reload: true,location: "replace"})
  }
}

const baseGuardType = (userType: string)=>{
  return (t: Transition, st: StateDeclaration)=> {
    const {state, user } = useServices(t);
    const isNotLogin = LoginRequired(t) 
    if (isNotLogin) return isNotLogin;
  
    user.runAfterUserExists(u=>{
      if (u.type !== userType){
        state.go('404',{ generic: true },{location: 'replace'})
        // redirectDependOnType(u,t)
      } 
    })
  }
}

export const LoginRequired = (t: any): any => {
  const {auth, state} = useServices(t);
  const to = t.to()
  const href = state.href(to,to.params)
  if(!auth.authenticated) return state.target('login',{ next: location.origin + href });
}

export const TaskerOnly = baseGuardType("tasker");
export const PosterOnly = baseGuardType("poster");
export const MerchantOnly = baseGuardType("merchant");

export const Logout = (t: any) => {
  const {auth, state} = useServices(t);

  if(auth.authenticated) auth.logout();
  (window as Window).location.href = '/login';
  // refresh the page to reset
  // all temporary storage values
}


export const AlreadyLogin = (t: Transition): any =>{
  const {auth, state} = useServices(t);
  if (auth.authenticated) {
    return state.target("signup")
  }
}