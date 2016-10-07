import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "./auth.guard";
import { LoginComponent } from "./login/";
import { MainInfoComponent } from "./main-info/";
import { ProductsComponent } from "./products/products.component";
import { AddProductComponent } from "./products/add-product/add-product.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { MachinesComponent, AddMachineComponent, FillMachineComponent } from "./machines/";
import { CategoriesComponent, AddCategoryComponent } from "./categories/";
import { UsersMangerComponent } from "./users/users.component";
import { ModuleWithProviders } from "@angular/core";
import { EditProductComponent } from "./products/edit-product/edit-product.component";
import {PurchasesComponent} from "./purchases/purchases.component";

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
    { path: 'users', component: UsersMangerComponent, canActivate: [AuthGuard]},
    { path: 'products/:id/edit', component: EditProductComponent, canActivate: [AuthGuard] },
    { path: 'purchases', component: PurchasesComponent, canActivate: [AuthGuard] }
  ]},
  { path: 'login', component: LoginComponent }
];

export const appRoutingProviders: any[] = [
  AuthGuard
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
