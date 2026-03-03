import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./pages/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
  },
  {
    path: 'privacy-policy',
    loadComponent: () => import('./pages/legal/privacy-policy/privacy-policy.component')
      .then(m => m.PrivacyPolicyComponent),
  },
  {
    path: 'terms-conditions',
    loadComponent: () => import('./pages/legal/terms-conditions/terms-conditions.component')
      .then(m => m.TermsConditionsComponent),
  },
  { path: 'contact',  
    loadComponent: () => import('./pages/legal/contact/contact.component')
      .then(m => m.ContactComponent) 
  },
  { path: 'security', 
    loadComponent: () => import('./pages/legal/security/security.component')
      .then(m => m.SecurityComponent) 
  },

  { path: '**', redirectTo: '' },
];

