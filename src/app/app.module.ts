import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TableModule } from 'primeng/table';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QueryBuilderComponent } from './query-builder/query-builder.component';
import { ToolbarModule } from 'primeng/toolbar';
import { QueryBuilderEditorComponent } from './query-builder-editor/query-builder-editor.component';
import { QueryBuilderTesterComponent } from './query-builder-tester/query-builder-tester.component';
import { Routes, RouterModule } from '@angular/router';
import { MainToolbarComponent } from './main-toolbar/main-toolbar.component';
import { ButtonModule, AutoCompleteModule } from 'primeng/primeng';
import { DropdownModule } from 'primeng/dropdown';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { EditorModule } from 'primeng/editor';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CardModule } from 'primeng/card';

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
    DropdownModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AutoCompleteModule,
    FormsModule,
    TableModule,
    InputTextareaModule,
    CardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
