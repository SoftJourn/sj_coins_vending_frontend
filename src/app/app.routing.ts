import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "./auth.guard";
import { LoginComponent } from "./login/";
import { MainInfoComponent } from "./main-info/";

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'main'},
  // {path: 'main', component: MainInfoComponent, canActivate: [AuthGuard]},
  {path: 'main', component: MainInfoComponent},
  {path: 'login', component: LoginComponent}
];

export const appRoutingProviders: any[] = [
  AuthGuard
];

export const routing = RouterModule.forRoot(routes);
