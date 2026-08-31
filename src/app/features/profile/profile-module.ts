import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared-module';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [ProfileComponent],
  imports: [SharedModule],
  exports: [ProfileComponent],
})
export class ProfileModule {}
