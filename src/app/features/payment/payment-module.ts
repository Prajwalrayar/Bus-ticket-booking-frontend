import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentComponent } from './payment/payment.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [PaymentComponent],
  imports: [CommonModule, FormsModule],
})
export class PaymentModule {}
