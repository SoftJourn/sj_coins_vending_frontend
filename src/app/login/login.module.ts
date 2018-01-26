import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { MatButtonModule, MatIconModule, MatInputModule} from '@angular/material';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import {OverlayModule} from '@angular/cdk/overlay';

@NgModule({
  imports: [
    CommonModule,
    LoginRoutingModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    OverlayModule
  ],
  declarations: [
    LoginComponent
  ]
})
export class LoginModule { }
