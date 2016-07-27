import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Mongo } from 'meteor/mongo';
import { ReactiveVar } from 'meteor/reactive-var';
import { LoginButtons } from 'angular2-meteor-accounts-ui';
import { MeteorComponent } from 'angular2-meteor';

import { Parties }   from '../../../both/collections/parties.collection';
import { Party } from '../../../both/interfaces/party.interface';
import { PartiesFormComponent } from './parties-form.component';

import template from './parties-list.component.html';

@Component({
  selector: 'parties-list',
  template,
  directives: [PartiesFormComponent, ROUTER_DIRECTIVES, LoginButtons]
})
export class PartiesListComponent extends MeteorComponent implements OnInit {
  parties: Mongo.Cursor<Party>;
  pageSize: number = 10;
  curPage: ReactiveVar<number> = new ReactiveVar<number>(1);
  nameOrder: number = 1;

  constructor() {
    super();
  }

  ngOnInit() {
    this.autorun(() => {
      const options = {
        limit: this.pageSize,
        skip: (this.curPage.get() - 1) * this.pageSize,
        sort: { name: this.nameOrder }
      };

      this.subscribe('parties', options, () => {
        this.parties = Parties.find({}, {sort: { name: this.nameOrder }});
      }, true);
    });
  }

  removeParty(party) {
    Parties.remove(party._id);
  }

  search(value: string) {
    this.parties = Parties.find(value ? { location: value } : {});
  }
}
