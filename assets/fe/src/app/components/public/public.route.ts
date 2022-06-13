import { Ng2StateDeclaration } from "@uirouter/angular";
import { AppComponent } from "src/app/app.component";
import { LoginComponent } from "./login/login.component"

export const PUBLIC_ROUTES: Ng2StateDeclaration[] = [
    {
        name: 'public',
        component: AppComponent
    },
    { 
        name: 'public.login',
        url: '/login',
        component: LoginComponent
    }
]