import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';

@Component({
    selector: 'app-subscriber-lists',
    templateUrl: './subscriber-lists.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class SubscriberListsComponent implements OnInit {

    constructor(private _script: ScriptLoaderService) { }

    ngOnInit() {
        this._script.loadScripts('app-subscriber-lists',
            ['assets/demo/default/custom/ajax/subscriptions/subscriber-list-ajax.js']);
    }

}
