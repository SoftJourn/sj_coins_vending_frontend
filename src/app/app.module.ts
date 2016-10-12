import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule,FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { AppComponent } from "./app.component";
import { routing, appRoutingProviders } from "./app.routing";
import { MdInputModule } from "@angular/material/input";
import { MdButtonModule } from "@angular/material/button";
import { MdIconModule } from "@angular/material/icon";
import { OverlayModule } from "@angular/material/core";
import { MainInfoComponent } from "./main-info/main-info.component";
import { LoginComponent } from "./login/login.component";
import { TopNavComponent } from "./shared/top-nav/top-nav.component";
import { SideBarComponent } from "./shared/side-bar/side-bar.component";
import { Ng2BootstrapModule, ButtonsModule } from "ng2-bootstrap/ng2-bootstrap";
import { ProductsComponent, ProductItemComponent, AddProductComponent } from "./products/";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { MachinesComponent, MachineItemComponent, AddMachineComponent, FillMachineComponent } from "./machines/";
import { CategoriesComponent, AddCategoryComponent } from "./categories/";
import { MachineService } from "./shared/services/machine.service";
import { DashboardService } from "./shared/services/dashboard.service";
import { CategoryService } from "./shared/services/category.service";
import { TokenService } from "./shared/services/token.service";
import { AccountService } from "./shared/services/account.service";
import { HttpService } from "./shared/services/http.service";
import { UsersComponent} from "./users/users.component";
import { MdCardModule } from "@angular/material/card";
import { MachineSizePipe } from "./machines/machine-item/machine-size.pipe";
import { ProductService } from "./shared/services/product.service";
import { SimpleNotificationsModule } from "angular2-notifications";
import { LdapUsersService } from "./shared/services/ldap.users.service";
import { AdminUsersService } from "./shared/services/admin.users.service";
import { EditProductComponent } from './products/edit-product/edit-product.component';
import { ImageUploadService } from './shared/services/image-upload.service';
import { PurchasesComponent } from './purchases/purchases.component';
import {PurchaseService} from "./shared/services/purchase.service";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {AddUserComponent} from "./users/add-user/add-user.component";

@NgModule({
  declarations: [
    AppComponent,
    MainInfoComponent,
    LoginComponent,
    TopNavComponent,
    SideBarComponent,
    ProductsComponent,
    ProductItemComponent,
    AddProductComponent,
    DashboardComponent,
    MachinesComponent,
    MachineItemComponent,
    AddMachineComponent,
    FillMachineComponent,
    CategoriesComponent,
    AddCategoryComponent,
    UsersComponent,
    AddCategoryComponent,
    MachineSizePipe,
    EditProductComponent,
    AddUserComponent,
    EditProductComponent,
    PurchasesComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    ReactiveFormsModule,
    routing,
    MdInputModule,
    MdButtonModule,
    MdIconModule,
    MdCardModule,
    OverlayModule,
    HttpModule,
    Ng2BootstrapModule,
    ButtonsModule,
    SimpleNotificationsModule,
    FormsModule,
    NgbModule.forRoot()
  ],
  providers: [
    TokenService,
    HttpService,
    AccountService,
    appRoutingProviders,
    MachineService,
    DashboardService,
    CategoryService,
    ProductService,
    LdapUsersService,
    AdminUsersService,
    ImageUploadService,
    PurchaseService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
