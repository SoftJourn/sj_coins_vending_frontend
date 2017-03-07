var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BrowserModule } from "@angular/platform-browser";
import { NgModule, ErrorHandler } from "@angular/core";
import { CommonModule, LocationStrategy, HashLocationStrategy } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
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
import { UsersComponent } from "./users/users.component";
import { MdCardModule } from "@angular/material/card";
import { MachineSizePipe } from "./machines/machine-item/machine-size.pipe";
import { ProductService } from "./shared/services/product.service";
import { SimpleNotificationsModule } from "angular2-notifications";
import { LdapUsersService } from "./shared/services/ldap.users.service";
import { AdminUsersService } from "./shared/services/admin.users.service";
import { EditProductComponent } from "./products/edit-product/edit-product.component";
import { ImageUploadService } from "./shared/services/image-upload.service";
import { PurchasesComponent } from "./purchases/purchases.component";
import { PurchaseService } from "./shared/services/purchase.service";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ModalImgCropperComponent } from "./shared/modal-img-cropper/modal-img-cropper.component";
import { ImageCropperComponent } from "ng2-img-cropper";
import { CoinManagementComponent } from "./coin-management/coin-management.component";
import { ModalModule } from "angular2-modal";
import { BootstrapModalModule } from "angular2-modal/plugins/bootstrap";
import { CoinService } from "./shared/services/coin.service";
import { EditMachineComponent } from "./machines/edit-machine/edit-machine.component";
import { DatePipe } from "./shared/pipes/date.pipe";
import { GlobalErrorHandler } from "./shared/global-error-handler";
import { TransactionsComponent } from "./transactions/transactions.component";
import { TransactionService } from "./shared/services/transaction.service";
import { UpperFirstSymbolPipe } from "./shared/pipes/upper-first-symbol.pipe";
import { TransactionFilterItemComponent } from "./transactions/transaction-filter-item/transaction-filter-item.component";
import { RlTagInputModule } from "angular2-tag-input";
import { TransactionComponent } from './transactions/transaction/transaction.component';
import { Md2Module } from "md2";
export var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        NgModule({
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
                PurchasesComponent,
                ModalImgCropperComponent,
                ImageCropperComponent,
                CoinManagementComponent,
                EditMachineComponent,
                DatePipe,
                TransactionsComponent,
                UpperFirstSymbolPipe,
                TransactionFilterItemComponent,
                TransactionComponent,
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
                NgbModule.forRoot(),
                ModalModule.forRoot(),
                BootstrapModalModule,
                RlTagInputModule,
                Md2Module.forRoot()
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
                PurchaseService,
                CoinService,
                TransactionService,
                { provide: ErrorHandler, useClass: GlobalErrorHandler },
                { provide: LocationStrategy, useClass: HashLocationStrategy }
            ],
            bootstrap: [AppComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
//# sourceMappingURL=/home/kraytsman/workspace/softjourn/sj_coins_vending_frontend/src/src/app/app.module.js.map