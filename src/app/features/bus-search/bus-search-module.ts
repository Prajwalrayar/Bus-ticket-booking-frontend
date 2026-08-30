import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusSearchComponent } from './bus-search.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [BusSearchComponent],
  imports: [CommonModule,RouterModule],
})
export class BusSearchModule {}
