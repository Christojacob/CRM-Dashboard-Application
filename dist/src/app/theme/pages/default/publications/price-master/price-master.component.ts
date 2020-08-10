import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';

@Component({
    selector: 'app-price-master',
    templateUrl: './price-master.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class PriceMasterComponent implements OnInit {

    constructor(private _script: ScriptLoaderService) { }

    ngOnInit() {
        this._script.loadScripts('app-price-master',
            ['assets/demo/default/custom/ajax/publications/price-master-ajax.js']);
    }

}
