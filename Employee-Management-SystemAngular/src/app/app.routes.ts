import { Routes } from '@angular/router';
import { Employee } from './employee/employee';
import { Home } from './home/home';
import { Login } from './login/login';
import { authGuard } from './auth-guard';

export const routes: Routes = [
    // {path:'',redirectTo:'/home',pathMatch:'full'},
    // {path:'home',component:Home},
    // {path:'employee',component:Employee},
    // {path:'login',component:Login}

    { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { 
    path: 'employee', 
    loadComponent: () => import('./employee/employee').then(m => m.Employee)
  },
  { 
    path: 'login', 
    loadComponent: () => import('./login/login').then(m => m.Login) 
  },
  { 
    path: 'welcome', 
    loadComponent: () => import('./welcome/welcome').then(m => m.Welcome),
    canActivate: [authGuard] 
  }
];
