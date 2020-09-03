import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/pages/home/home.component';
import { TestComponent } from './components/pages/test/test.component';
import { FormatoEditComponent } from './components/pages/formato-edit/formato-edit.component';
import { FormatoCrudComponent } from './components/pages/formato-crud/formato-crud.component';
import { ProductoCrudComponent } from './components/pages/producto-crud/producto-crud.component';
import { UsuarioLoginComponent } from './components/pages/usuario-login/usuario-login.component';
import { UsuarioAddSystemComponent } from './components/pages/usuario-add-system/usuario-add-system.component';
import { UsuarioAddComponent } from './components/pages/usuario-add/usuario-add.component';
import { UsuarioCrudComponent } from './components/pages/usuario-crud/usuario-crud.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'formato/edit/:codigo',
    component: FormatoEditComponent
  },
  {
    path: 'formato/crud',
    component: FormatoCrudComponent
  },
  {
    path: 'producto/crud',
    component: ProductoCrudComponent
  },
  {
    path: 'usuario/crud',
    component: UsuarioCrudComponent
  },
  {
    path: 'usuario/login',
    component: UsuarioLoginComponent
  },
  {
    path: 'usuario/system',
    component: UsuarioAddSystemComponent
  },
  {
    path: 'usuario/add/:token',
    component: UsuarioAddComponent
  },
  {
    path: 'test',
    component: TestComponent
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
