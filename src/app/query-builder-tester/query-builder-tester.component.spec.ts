import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryBuilderTesterComponent } from './query-builder-tester.component';

describe('QueryBuilderTesterComponent', () => {
  let component: QueryBuilderTesterComponent;
  let fixture: ComponentFixture<QueryBuilderTesterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueryBuilderTesterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryBuilderTesterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
