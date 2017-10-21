import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderResumenPage } from './order-resumen';

@NgModule({
  declarations: [
    OrderResumenPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderResumenPage),
  ],
})
export class OrderResumenPageModule {}
