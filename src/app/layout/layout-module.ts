import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared-module';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';

@NgModule({
  declarations: [MainLayoutComponent, AuthLayoutComponent],
  imports: [SharedModule, RouterModule],
  exports: [MainLayoutComponent, AuthLayoutComponent],
})
export class LayoutModule {}
