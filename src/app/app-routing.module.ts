import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { QuizComponent } from './quiz/quiz.component';
import { LoginComponent } from './login/login.component';
import { AuthGuardService as AuthGuard  } from './services/auth.guard';
const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'home', component: HomePageComponent,canActivate:[AuthGuard] },
  { path: 'quiz/:id', component: QuizComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
