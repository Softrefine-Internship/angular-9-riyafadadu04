import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { BlogDetailComponent } from './blogs/blog-detail/blog-detail.component';
import { BlogComponent } from './blogs/blog/blog.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { AuthGuard } from './auth/auth.guard';

const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'blog', component: BlogComponent, canActivate: [AuthGuard] },
  {
    path: 'blog/:id',
    component: BlogDetailComponent,
    canActivate: [AuthGuard],
  },
  { path: '404', component: NotfoundComponent },
  { path: '**', redirectTo: '404', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
