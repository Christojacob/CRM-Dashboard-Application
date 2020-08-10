import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';

@Component({
    selector: 'app-transactions-lists',
    templateUrl: './transactions-lists.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class TransactionsListsComponent implements OnInit {

    constructor(private _script: ScriptLoaderService) { }

    ngOnInit() {
        this._script.loadScripts('app-transactions-lists',
            ['assets/demo/default/custom/ajax/donations/transactions-lists-ajax.js']);
    }

}
