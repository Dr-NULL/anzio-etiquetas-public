import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgZorroAntdModule, NZ_I18N, es_ES } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';

// Custom Components
import { HomeComponent } from './components/pages/home/home.component';
import { FormatoEditComponent } from './components/pages/formato-edit/formato-edit.component';
import { LabelComponent } from './components/shared/label/label.component';
import { LabelTextComponent } from './components/shared/label-text/label-text.component';
import { TabCtrlComponent } from './components/shared/tab-ctrl/tab-ctrl.component';
import { TabViewComponent } from './components/shared/tab-view/tab-view.component';
import { TabElemComponent } from './components/shared/tab-elem/tab-elem.component';
import { LabelRectComponent } from './components/shared/label-rect/label-rect.component';
import { FormatoTextComponent } from './components/shared/formato-text/formato-text.component';
import { FormatoRectComponent } from './components/shared/formato-rect/formato-rect.component';
import { FormatoPictComponent } from './components/shared/formato-pict/formato-pict.component';
import { LabelPictComponent } from './components/shared/label-pict/label-pict.component';
import { PicturePickerComponent } from './components/shared/picture-picker/picture-picker.component';
import { UploaderDragComponent } from './components/shared/uploader-drag/uploader-drag.component';
import { ModalLoadingComponent } from './components/shared/modal-loading/modal-loading.component';
import { FormatoTestComponent } from './components/shared/formato-test/formato-test.component';
import { CmdInputComponent } from './components/shared/cmd-input/cmd-input.component';
import { CmdDatepickerComponent } from './components/shared/cmd-datepicker/cmd-datepicker.component';
import { FormatoCrudComponent } from './components/pages/formato-crud/formato-crud.component';
import { ModalGenComponent } from './components/shared/modal-gen/modal-gen.component';
import { FormatoCrudPrinterComponent } from './components/pages/formato-crud-printer/formato-crud-printer.component';
import { FormatoCrudAssignComponent } from './components/pages/formato-crud-assign/formato-crud-assign.component';
import { AngKnobComponent } from './components/shared/ang-knob/ang-knob.component';
import { TestComponent } from './components/pages/test/test.component';
import { ProductoCrudComponent } from './components/pages/producto-crud/producto-crud.component';
import { ProductoCrudEditComponent } from './components/pages/producto-crud-edit/producto-crud-edit.component';
import { SearchTableComponent } from './components/shared/search-table/search-table.component';
import { UsuarioLoginComponent } from './components/pages/usuario-login/usuario-login.component';
import { UsuarioAddSystemComponent } from './components/pages/usuario-add-system/usuario-add-system.component';
import { UsuarioAddComponent } from './components/pages/usuario-add/usuario-add.component';
import { SideMenuComponent } from './components/shared/side-menu/side-menu.component';
import { SideMenuItemComponent } from './components/shared/side-menu-item/side-menu-item.component';
import { UsuarioCrudComponent } from './components/pages/usuario-crud/usuario-crud.component';
import { UsuarioCrudAddComponent } from './components/pages/usuario-crud-add/usuario-crud-add.component';
import { UsuarioCrudQueueComponent } from './components/pages/usuario-crud-queue/usuario-crud-queue.component';

registerLocaleData(es);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FormatoEditComponent,
    LabelComponent,
    LabelTextComponent,
    TabCtrlComponent,
    TabViewComponent,
    TabElemComponent,
    LabelRectComponent,
    FormatoTextComponent,
    FormatoRectComponent,
    FormatoPictComponent,
    LabelPictComponent,
    PicturePickerComponent,
    UploaderDragComponent,
    ModalLoadingComponent,
    FormatoTestComponent,
    CmdInputComponent,
    CmdDatepickerComponent,
    FormatoCrudComponent,
    ModalGenComponent,
    FormatoCrudPrinterComponent,
    FormatoCrudAssignComponent,
    AngKnobComponent,
    TestComponent,
    ProductoCrudComponent,
    ProductoCrudEditComponent,
    SearchTableComponent,
    UsuarioLoginComponent,
    UsuarioAddSystemComponent,
    UsuarioAddComponent,
    SideMenuComponent,
    SideMenuItemComponent,
    UsuarioCrudComponent,
    UsuarioCrudAddComponent,
    UsuarioCrudQueueComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [{ provide: NZ_I18N, useValue: es_ES }],
  bootstrap: [AppComponent]
})
export class AppModule { }
