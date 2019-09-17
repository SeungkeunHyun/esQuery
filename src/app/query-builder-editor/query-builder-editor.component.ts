import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-query-builder-editor',
  templateUrl: './query-builder-editor.component.html',
  styleUrls: ['./query-builder-editor.component.scss']
})
export class QueryBuilderEditorComponent implements OnInit {
  indices: string[];
  selectedIndex: string;
  constructor() { }

  ngOnInit() {
  }

}
