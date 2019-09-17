import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryBuilderEditorComponent } from './query-builder-editor.component';

describe('QueryBuilderEditorComponent', () => {
  let component: QueryBuilderEditorComponent;
  let fixture: ComponentFixture<QueryBuilderEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueryBuilderEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryBuilderEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
