import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GimnasioHomeComponent} from './gimnasio-home/gimnasio-home.component';
import {AdminHomeComponent} from './admin-home/admin-home.component';

const routes: Routes = [
  { // Rutas para el usuario
    path: '',
    component: GimnasioHomeComponent,
    children: []
  },
  { // Rutas para el administrador
    path: 'admin',
    component: AdminHomeComponent,
    children: []
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
