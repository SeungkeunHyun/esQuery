import { ESServiceService } from './../esservice.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-query-builder-editor',
  templateUrl: './query-builder-editor.component.html',
  styleUrls: ['./query-builder-editor.component.scss']
})
export class QueryBuilderEditorComponent implements OnInit {
  indices: any[];
  selectedIndex: string;
  selectedField: string;
  esHost: string;
  esHosts: any[];
  documents: any[];
  selectedDoc: string;
  document: object;
  suggestions: string[];
  fields: any[];
  countsPerValue: any[];
  qryText: string;
  qryRows: number;
  selectedValue: string;
  constructor(private esservice: ESServiceService) {
    this.indices = [];
  }

  storeHost(host) {
    let hostString = localStorage.getItem("esHosts");
    let hosts: any[];
    if (hostString) {
      hosts = JSON.parse(hostString);
      if(hosts.indexOf(host) == -1) {
        hosts.push(host);
      }
    } else {
      hosts = [host];
      localStorage.setItem("esHosts", JSON.stringify(hosts));
    }
    this.esHosts = hosts;
  }

  getCounts(e) {
    console.log(e, this.selectedIndex, this.selectedField);
    this.selectedValue = this.document[this.selectedField.replace('.keyword', '')];
    const qry = `${this.esHost}/${this.selectedIndex}/_search?size=0`
    const param = {aggs: {count_per_value: {terms: {field: this.selectedField, size: 1000, order: {_count: 'desc'}}}}};
    this.esservice.post(qry, param).subscribe(res => {
      console.log(res);
      this.countsPerValue = res == null ? null : res.aggregations.count_per_value.buckets;
      this.qryText = JSON.stringify(param,null,2);
      this.qryRows = this.qryText.split(/\n/).length;
      console.log(this.countsPerValue);
    });
  }

  connectToES(e) {
    console.log(e);
    if(!e.target.validity.valid) {
      return;
    }
    this.esHost = e.target.value;
    this.storeHost(this.esHost);
    this.esservice.get(this.esHost + "/_cat/indices?format=json").subscribe(res => {
      console.log(res);
      this.indices = [];
      res.forEach(i => this.indices.push(i.index));
      console.log(this.indices);
    });
  }

  pickIndices(e) {
    console.log(e.query);
    this.suggestions = this.indices.filter(i => i.indexOf(e.query) > -1)
  }

  getDocument(e) {
    console.log(e);
    this.esservice.post(`${this.esHost}/${this.selectedIndex}/_search`, {query: {term: {_key: e.value}}}).subscribe(res => {
      if(res == null || !res.hasOwnProperty('hits')) {
        return;
      }
      this.document = res.hits.hits[0]._source;
    });
  }

  getDocuments(e) {
    this.getFields(e);
    this.esservice.get(`${this.esHost}/${this.selectedIndex}/_search`).subscribe(docs => {
      this.documents = [];
      docs.hits.hits.forEach(i => this.documents.push({ label: i._source._key, value: i._source._key}));
      console.log(docs,this.documents);
    });
  }

  getFields(e) {
    this.esservice.get(this.esHost + '/' + e).subscribe(def => {
      this.fields = [];
      console.log(def[e]);
      const props = def[e].mappings.doc.properties;
      for(let p in props) {
        this.fields.push({label: `${p} (${props[p].type})`, value: `${props[p].type == 'text' ? p + '.keyword' : p}`});
      }
    });
  }


  ngOnInit() {

  }

}
