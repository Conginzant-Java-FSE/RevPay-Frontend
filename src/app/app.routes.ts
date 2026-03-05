import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { ShellComponent } from './shared/shell/shell.component';

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
     path: 'payment-methods',
     loadComponent: () => import('./pages/payment-methods/payment-methods.component').then(m => m.PaymentMethodsComponent) 
  },
  {
    path: '',
    component: ShellComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'transactions', loadComponent: () => import('./pages/transactions/transactions.component').then(m => m.TransactionsComponent) },
      { path: 'notifications', loadComponent: () => import('./pages/notifications/notifications.component').then(m => m.NotificationsComponent) },
      { path: 'settings', loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent) },
      { path: 'requests', loadComponent: () => import('./pages/requests/requests.component').then(m => m.RequestsComponent) },
      { path: 'send-money', loadComponent: () => import('./pages/send-money/send-money.component').then(m => m.SendMoneyComponent) },
    ]
  },

  
  { path: '**', redirectTo: '' },
];

