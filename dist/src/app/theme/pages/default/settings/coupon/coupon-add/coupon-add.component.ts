import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Helpers } from '../../../../../../helpers';
import { CouponService } from '../coupon.service';

@Component({
    selector: 'app-coupon-add',
    templateUrl: './coupon-add.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class CouponAddComponent implements OnInit, AfterViewInit {

    countryList: any;
    createForm: any;
    formError = false;

    constructor(public formBuilder: FormBuilder,private _couponService:CouponService) {
        this.formInit();
    }

    ngOnInit() {
        let _self=this;
        setTimeout(() => {
            Helpers.datepickerInit($('input[name="couponValidFrom"]'));
            Helpers.datepickerInit($('input[name="couponValidTo"]'));
            $('input[name="couponValidFrom"]').change(function(){
                _self.createForm.controls['ValidFrom'].setValue($(this).val())
            });
            $('input[name="couponValidTo"]').change(function(){
                _self.createForm.controls['ValidTo'].setValue($(this).val());
            });
        }, 0);
    }

    ngAfterViewInit() {
    }

    formInit() {
        this.createForm = this.formBuilder.group({
            Name: ['', Validators.required],
            Description: ['', Validators.required],
            ValidFrom: ['', Validators.required],
            ValidTo: ['', Validators.required],
            DiscoutType: ['', Validators.required],
            DiscountValue: ['', Validators.required],
            MaximumDeduction: ['', Validators.required],
            MaximumPurchase: ['', Validators.required]
        });
    }

    create() {
        this.formError = true;
        if (!this.createForm.valid) {
            Helpers.DisplayMsg({ status: 'error', msg: 'Please fill all mandatory fields' })
        } else {
            Helpers.setLoading(true);
            this._couponService.couponAdd(this.createForm.value).subscribe(
                data => {
                    if (data.status == 'success') {
                        Helpers.setLoading(false);
                        Helpers.DisplayMsg(data)
                        this.createForm.reset()
                        this.formInit();
                        this.formError = false;
                    } else {
                        Helpers.setLoading(false);
                        Helpers.DisplayMsg(data)
                    }

                },
                error => {
                    Helpers.DisplayMsg({ status: 'error', msg: 'Something when wrong.Please try later' })
                    Helpers.setLoading(false);
                });
        }
    }

  

}
