import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { AppConsts, TokenService, AccountService } from "./shared/";
import { routing, appRoutingProviders } from "./app.routing";
import { MdInputModule } from "@angular2-material/input";
import { MdButtonModule } from "@angular2-material/button";
import { MdIconModule } from "@angular2-material/icon";
import { OverlayModule } from "@angular2-material/core";
import { MainInfoComponent } from "./main-info/main-info.component";
import { LoginComponent } from "./login/login.component";
import { TopNavComponent } from './shared/top-nav/top-nav.component';
import { SideBarComponent } from './shared/side-bar/side-bar.component';
import { Ng2BootstrapModule, ButtonsModule } from "ng2-bootstrap/ng2-bootstrap"


@NgModule({
  declarations: [
    AppComponent,
    MainInfoComponent,
    LoginComponent,
    TopNavComponent,
    SideBarComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    ReactiveFormsModule,
    routing,
    MdInputModule,
    MdButtonModule,
    MdIconModule,
    OverlayModule,
    HttpModule,
    Ng2BootstrapModule,
    ButtonsModule
  ],
  providers: [
    AppConsts,
    TokenService,
    AccountService,
    appRoutingProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
