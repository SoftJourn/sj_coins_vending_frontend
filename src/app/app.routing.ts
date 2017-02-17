import {
  Routes,
  RouterModule
} from "@angular/router";
import {AuthGuard} from "./auth.guard";
import {LoginComponent} from "./login/";
import {MainInfoComponent} from "./main-info/";
import {ProductsComponent} from "./products/products.component";
import {AddProductComponent} from "./products/add-product/add-product.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {
  MachinesComponent,
  AddMachineComponent,
  FillMachineComponent
} from "./machines/";
import {
  CategoriesComponent,
  AddCategoryComponent
} from "./categories/";
import {ModuleWithProviders} from "@angular/core";
import {EditProductComponent} from "./products/edit-product/edit-product.component";
import {PurchasesComponent} from "./purchases/purchases.component";
import {UsersComponent} from "./users/users.component";
import {CoinManagementComponent} from "./coin-management/coin-management.component";
import {EditMachineComponent} from "./machines/edit-machine/edit-machine.component";
import {TransactionsComponent} from "./transactions/transactions.component";

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'main'},
  {
    path: 'main', component: MainInfoComponent, children: [
    {path: '', component: DashboardComponent, canActivate: [AuthGuard]},
    {path: 'products', component: ProductsComponent, canActivate: [AuthGuard]},
    {path: 'products/add', component: AddProductComponent, canActivate: [AuthGuard]},
    {path: 'machines', component: MachinesComponent, canActivate: [AuthGuard]},
    {path: 'machines/add', component: AddMachineComponent, canActivate: [AuthGuard]},
    {path: 'machines/fill/:id', component: FillMachineComponent, canActivate: [AuthGuard]},
    {path: 'coins', component: CoinManagementComponent, canActivate: [AuthGuard]},
    {path: 'transactions', component: TransactionsComponent, canActivate: [AuthGuard]},
    {path: 'categories', component: CategoriesComponent, canActivate: [AuthGuard]},
    {path: 'categories/add', component: AddCategoryComponent, canActivate: [AuthGuard]},
    {path: 'users', component: UsersComponent, canActivate: [AuthGuard]},
    {path: 'products/:id/edit', component: EditProductComponent, canActivate: [AuthGuard]},
    {path: 'purchases', component: PurchasesComponent, canActivate: [AuthGuard]},
    {path: 'machines/:id/edit', component: EditMachineComponent, canActivate: [AuthGuard]}
  ]
  },
  {path: 'login', component: LoginComponent}
];

export const appRoutingProviders: any[] = [
  AuthGuard
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
