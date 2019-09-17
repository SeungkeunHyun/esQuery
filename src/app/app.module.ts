import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QueryBuilderComponent } from './query-builder/query-builder.component';
import { ToolbarModule } from 'primeng/toolbar';
import { QueryBuilderEditorComponent } from './query-builder-editor/query-builder-editor.component';
import { QueryBuilderTesterComponent } from './query-builder-tester/query-builder-tester.component';
import { Routes, RouterModule } from '@angular/router';
import { MainToolbarComponent } from './main-toolbar/main-toolbar.component';
import { ButtonModule } from 'primeng/primeng';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
  declarations: [
    AppComponent,
    QueryBuilderComponent,
    QueryBuilderEditorComponent,
    QueryBuilderTesterComponent,
    MainToolbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ToolbarModule,
    ButtonModule,
    DropdownModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
