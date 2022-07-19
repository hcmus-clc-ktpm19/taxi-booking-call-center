import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './user/auth.guard';

const routes: Routes = [
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then( m => m.UserModule),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'booking',
    pathMatch: 'full'
  },
  {
    path: 'booking',
    loadChildren: () => import('./booking/booking.module').then( m => m.BookingModule),
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
