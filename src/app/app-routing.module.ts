import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainInfoComponent } from "./main-info/main-info.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ProductsComponent } from "./products/products.component";
import { AddProductComponent } from "./products/add-product/add-product.component";
import { AuthGuard } from "./auth.guard";
import { MachinesComponent } from "./machines/machines.component";
import { AddMachineComponent } from "./machines/add-machine/add-machine.component";
import { FillMachineComponent } from "./machines/fill-machine/fill-machine.component";
import { CategoriesComponent } from "./categories/categories.component";
import { AddCategoryComponent } from "./categories/add-category/add-category.component";
import { UsersMangerComponent } from "./users/users.component";
import { LoginComponent } from "./login/login.component";

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'main' },
  { path: 'main', component: MainInfoComponent, children: [
    { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'products', component: ProductsComponent, canActivate: [AuthGuard] },
    { path: 'products/add', component: AddProductComponent, canActivate: [AuthGuard] },
    { path: 'machines', component: MachinesComponent, canActivate: [AuthGuard] },
    { path: 'machines/add', component: AddMachineComponent, canActivate: [AuthGuard] },
    { path: 'machines/fill/:id', component: FillMachineComponent, canActivate: [AuthGuard] },
    { path: 'categories', component: CategoriesComponent, canActivate: [AuthGuard] },
    { path: 'categories/add', component: AddCategoryComponent, canActivate: [AuthGuard] },
    { path: 'users', component: UsersMangerComponent, canActivate: [AuthGuard]}
  ]},
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class VendingAdminRoutingModule { }
