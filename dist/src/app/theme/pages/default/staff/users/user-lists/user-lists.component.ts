import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../../../../helpers';
import { Router } from "@angular/router";
import { CommonCrudService } from '../../../../../../_services/common-crud.service';
import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';
import { StaffService } from '../staff.service'

@Component({
    selector: 'app-user-lists',
    templateUrl: './user-lists.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class UserListsComponent implements OnInit, AfterViewInit {
    adv = true;
    optionField: any = Helpers.datatableOptions();
    hidenFields: any;
    constructor(public _staffService: StaffService, public router: Router, private _script: ScriptLoaderService, public helper: Helpers, private _curd: CommonCrudService) {

    }
    ngOnInit() {

    }
    ngAfterViewInit() {
        let mm = this;
        let apiUrl = this.helper.ApiBaseUrl;
        this.optionField.data.source.read.url = apiUrl + 'staff';
        let item = [
            { field: 'Email', title: 'First Name' },
            { field: 'FirstName', title: 'First Name' },
            { field: 'LastName', title: 'Last Name' },
            { field: 'Gender', title: 'Gender' },
            { field: 'MobileNumber', title: 'Mobile Number' },
            { field: 'SecondaryNumber', title: 'Secondary Number' }];

        for (let i = 0; i < item.length; i++) {
            this.optionField.columns.splice(this.optionField.columns.length - 1, 0, <any>item[i]);
        }

        $(document).ready(function() {

            let datatable = (<any>$('.m_datatable')).mDatatable(mm.optionField);

            $('#m_form_status').on('change', function() {
                datatable.search($(this).val(), 'Status');
            });

            $('#m_form_type').on('change', function() {
                datatable.search($(this).val(), 'Type');
            });

            // $('#m_form_status, #m_form_type').selectpicker();

            $(datatable).on('m-datatable--on-layout-updated', function() {

                $('.edit-button').on('click', function() {
                    let id = $(this).attr('data');
                    mm.editClick(id);
                })

                $('.delete-button').on('click', function() {
                    let id = $(this).attr('data');
                    let del = mm.deleteClick(id);
                })

            });
            

            Helpers.staticDropdown(datatable);
            mm._curd.getData({ url: 'settings/custom-listing-fields', params: { Module: "settings", ListingPage: "state_listing" } }).subscribe(data => {
                for (let i = 0; i < data.data.length; i++) {
                    let index = mm.optionField.columns.findIndex(record => record.field === data.data[i].Name)
                    if (index != -1) {
                        mm.optionField.columns[index].isHide = data.data[i].IsHide;
                        if (data.data[i].IsHide == 1) {
                            datatable.hideColumn(data.data[i].Name);
                        } else {
                            datatable.showColumn(data.data[i].Name);
                        }
                    }
                }
            })

            

            $('.columnCheckbox').on('change', function() {
                let columnChanged = [];
                $('.columnCheckbox').each(function() {
                    if ($(this).is(":checked")) {
                        datatable.showColumn($(this).val())
                        columnChanged.push({ Name: $(this).val(), IsHide: 0 })
                    } else {
                        columnChanged.push({ Name: $(this).val(), IsHide: 1 })
                        datatable.hideColumn($(this).val());
                    }
                })
                mm._curd.putData({ url: 'settings/custom-listing-fields/update', params: { Module: "settings", ListingPage: "state_listing", Fields: columnChanged } })
            })

        })

        

    }

    editClick(id) {
        this.router.navigateByUrl('/staff/edit/' + id);
    }

    deleteClick(id) {
        if (confirm("Are you sure?")) {

            Helpers.setLoading(true);
            this._staffService.StaffDelete(id).subscribe(
                data => {
                    Helpers.setLoading(false);
                    if (data.status == "success") {
                        Helpers.DisplayMsg(data)
                        this.router.routeReuseStrategy.shouldReuseRoute = function() { return false; };
                        let currentUrl = this.router.url + '?';
                        this.router.navigateByUrl(currentUrl)
                            .then(() => {
                                this.router.navigated = false;
                                this.router.navigate([this.router.url]);
                            });
                    } else {
                        Helpers.DisplayMsg(data)
                    }
                },
                error => {
                    Helpers.setLoading(false);
                    Helpers.DisplayMsg({ status: 'error', msg: 'Something when wrong.Please try later' });
                });
        }
    }

}
