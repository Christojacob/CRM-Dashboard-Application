import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../../../../helpers';
import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';

@Component({
    selector: 'app-region-lists',
    templateUrl: './region-lists.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class RegionListsComponent implements OnInit {

    constructor(private _script: ScriptLoaderService) { }

    ngOnInit() {
        this._script.loadScripts('app-region-lists',
            ['assets/demo/default/custom/ajax/region-ajax.js']);
    }

}
