import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "./auth.guard";
import { LoginComponent } from "./login/";
import { MainInfoComponent } from "./main-info/";
import { ProductsComponent } from "./products/products.component";
import { AddProductComponent } from "./products/add-product/add-product.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { MachinesComponent, AddMachineComponent, FillMachineComponent } from "./machines/";
import { CategoriesComponent, AddCategoryComponent } from "./categories/";

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'main' },
  // {path: 'main', component: MainInfoComponent, canActivate: [AuthGuard]},
  { path: 'main', component: MainInfoComponent, children: [
    { path: '', component: DashboardComponent },
    { path: 'products', component: ProductsComponent },
    { path: 'products/add', component: AddProductComponent },
    { path: 'machines', component: MachinesComponent },
    { path: 'machines/add', component: AddMachineComponent },
    { path: 'machines/fill', component: FillMachineComponent },
    { path: 'categories', component: CategoriesComponent },
    { path: 'categories/add', component: AddCategoryComponent }
  ]},
  { path: 'login', component: LoginComponent }
];

export const appRoutingProviders: any[] = [
  AuthGuard
];

export const routing = RouterModule.forRoot(routes);
