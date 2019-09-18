import { ESServiceService } from './../esservice.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MessageService, MenuItem } from 'primeng/api';
import { ContextMenuModule, ContextMenu } from 'primeng/contextmenu';
@Component({
  selector: 'app-query-builder-editor',
  templateUrl: './query-builder-editor.component.html',
  styleUrls: ['./query-builder-editor.component.scss'],
  providers: [MessageService]
})
export class QueryBuilderEditorComponent implements OnInit {
  @ViewChild('popupOptions', null) popupOptions: ContextMenu;
  @ViewChild('fieldList', null) fieldList: ElementRef;
  indices: any[];
  selectedIndex: string;
  selectedField: string;
  esHost: string;
  selectedFieldObj: {type: string, name: string, value: string};
  esHosts: any[];
  documents: any[];
  selectedDoc: string;
  document: object;
  suggestions: string[];
  fields: any[];
  countsPerValue: any[];
  qryText: string;
  resultText: string;
  qryRows: number;
  selectedValue: string;
  calcOptions: MenuItem[];
  calcFields: any[];
  popCalcOptions: MenuItem[];
  baseDate: any;
  searchTerms: any[];
  daysBefore: number;
  constructor(private esservice: ESServiceService, private messageService: MessageService) {
    this.indices = [];
  }

  storeHost(host) {
    let hostString = localStorage.getItem('esHosts');
    let hosts: any[];
    if (hostString) {
      hosts = JSON.parse(hostString);
      if(hosts.indexOf(host) == -1) {
        hosts.push(host);
      }
    } else {
      hosts = [host];
      localStorage.setItem('esHosts', JSON.stringify(hosts));
    }
    this.esHosts = hosts;
  }

  connectToES(e) {
    console.log(e);
    if(!e.target.validity.valid) {
      return;
    }
    this.esHost = e.target.value;
    this.storeHost(this.esHost);
    this.esservice.get(this.esHost + '/_cat/indices?format=json').subscribe(res => {
      console.log(res);
      this.indices = [];
      res.forEach(i => this.indices.push(i.index));
      console.log(this.indices);
      this.messageService.add({ severity: 'success', summary: 'ES connected', detail: 'Fetched Index list' });
    });
  }

  pickIndices(e) {
    console.log(e.query);
    this.suggestions = this.indices.filter(i => i.indexOf(e.query) > -1)
  }

  getDocument(e) {
    console.log(e);
    this.esservice.post(`${this.esHost}/${this.selectedIndex}/_search`, {query: {term: {_key: e.value}}}).subscribe(res => {
      const data: any = res;
      if(data == null || !data.hasOwnProperty('hits')) {
        return;
      }
      this.document = data.hits.hits[0]._source;
      this.getFields(this.selectedIndex, this.document);
    });
  }

  getDocuments(e) {
    this.getFields(e);
    this.calcOptions = [{ label: 'Search Term' }, { label: 'Period' }, { label: 'Calc Target' }];
    this.calcOptions.forEach(i => i.command = e => this.setCalcOption(i));
    this.esservice.get(`${this.esHost}/${this.selectedIndex}/_search`).subscribe(docs => {
      this.documents = [];
      docs.hits.hits.forEach(i => this.documents.push({ label: i._source._key, value: i._source._key}));
      console.log(docs,this.documents);
    });
  }

  getCalculations(e, cm: ContextMenu) {
    console.log(e, cm);
    if(!e || e.value.length === 0) {
      return;
    }
    this.selectedFieldObj = e.value[0];
    this.popCalcOptions = this.calcOptions;
    if(this.selectedFieldObj.type !== 'date') {
      this.popCalcOptions = this.popCalcOptions.filter(i => i.label !== 'Period');
    }
    cm.show(e.originalEvent);
    e.originalEvent.stopPropagation();
    //const p = e.value[0];
    //this.esservice.post(`${this.esHost}/${this.selectedIndex}/_search?size=0`, this.generateCalcs(p));
  }

  setCalcOption(e) {
    console.log(e);
    switch(e.label) {
      case 'Search Term':
        this.searchTerms.push(this.selectedFieldObj);
        console.log(this.searchTerms);
        break;
      case 'Period':
        this.baseDate = this.selectedFieldObj;
        break;
      case 'Calc Target':
        this.calcFields.push(this.selectedFieldObj);
        break;
    }
  }

  dummy(e) {

  }

  generateCalcs(){
    let terms: any = {query: {bool: {must: []}}};
    this.searchTerms.forEach(s => {
      let fname: string = s.name;
      if(s.type === 'text') {
        fname += '.keyword';
      }
      let val = s.value;
      let qry = {'term': {}};
      qry.term[fname] = val;
      terms.query.bool.must.push(qry);
    });
    terms.query.bool.filter = {'range': {}};
    terms.query.bool.filter.range[this.baseDate.name] =
    {'gte': this.baseDate.value + '||-' + this.daysBefore + 'd', 'lte': this.baseDate.value}
    terms.aggs = this.generateAggregations();
    console.log(terms);
    return terms;
  }

  removeTerm(term) {
    this.searchTerms = this.searchTerms.filter(i => i !== term);
  }

  removeCalc(calc) {
    this.calcFields = this.calcFields.filter(c => c !== calc);
  }

  generateAggregations() {
    const num_aggs: string[] = ['max', 'min', 'sum', 'avg'];
    const date_aggs: string[] = ['max', 'min'];
    let aggs = {};
    this.calcFields.forEach(c => {
      if(c.type === 'long' || c.type === 'float') {
        num_aggs.forEach(n => {
          const agg_fname = n + '_' + c.name;
          aggs[agg_fname] = {};
          aggs[agg_fname][n] = {field: c.name};
        });
      } else if(c.type === 'date') {
        date_aggs.forEach(n => {
          const agg_fname = n + '_' + c.name;
          aggs[agg_fname] = {};
          aggs[agg_fname][n] = { field: c.name };
        });
      } else if(c.type ==='text') {
        aggs['count_' + c.name] = {'value_count': {field: c.name + '.keyword'}};
      } else {
        aggs['count_' + c.name] = { 'value_count': { field: c.name } };
      }
    });
    return aggs;
  }

  getFields(e, doc?) {
    this.searchTerms = [];
    this.calcFields = [];
    this.esservice.get(this.esHost + '/' + e).subscribe(def => {
      this.fields = [];
      console.log(def[e]);
      const props = def[e].mappings.doc.properties;
      for(let p in props) {
        if(doc) {
          this.fields.push({name: p, type: props[p].type, value: doc[p]});
        } else {
          this.fields.push({ name: p, type: props[p].type});
        }
      }
    });
  }

  calculate(e) {
    const param = this.generateCalcs();
    this.esservice.post(`${this.esHost}/${this.selectedIndex}/_search?size=0`, param).subscribe(res => {
      this.resultText = JSON.stringify(res, null, 2);
      console.log(res);
    });
    this.qryText = JSON.stringify(param, null, 2);
    //this.qryRows = this.qryText.split(/\n/).length;
  }

  ngOnInit() {

  }

}
