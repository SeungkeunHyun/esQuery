import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QueryBuilderEditorComponent } from './query-builder-editor/query-builder-editor.component';
import { QueryBuilderTesterComponent } from './query-builder-tester/query-builder-tester.component';


const routes: Routes = [
  { path: 'qbEdit', component: QueryBuilderEditorComponent },
  { path: 'qbTest', component: QueryBuilderTesterComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
