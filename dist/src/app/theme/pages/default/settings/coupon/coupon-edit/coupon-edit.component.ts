import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Helpers } from '../../../../../../helpers';

import { CouponService } from '../coupon.service';

@Component({
    selector: 'app-coupon-edit',
    templateUrl: './coupon-edit.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class CouponEditComponent implements OnInit, AfterViewInit {

    countryList: any;
    createForm: any;
    paymentForm: any;
    formError = false;
    routeParams: any;
    selectedTab: any = 'edit';

    paymentMaster: any;
    paymentMethod: any;
    paymentGateway: any;

    PaymentSettings: any = [];

    constructor(public formBuilder: FormBuilder, private _couponService: CouponService,private activeRoute: ActivatedRoute) {
        this.formInit();

    }



    ngOnInit() {
        this.routeParams = this.activeRoute.snapshot.params;
              
    }

    ngAfterViewInit() {
        this.getEditCoupon();
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

   

    getEditCoupon() {
        Helpers.setLoading(true);
        return this._couponService.couponEdit(this.routeParams.CouponId).subscribe(
            data => {
                Helpers.setLoading(false);
                
                let couponData=data.data.CouponDetails[0];
                this.createForm = this.formBuilder.group({
                    Name: [couponData.Code, Validators.required],
                    Description: [couponData.Description, Validators.required],
                    ValidFrom: [this._couponService.dateConvertGet(couponData.ValidFrom), Validators.required],
                    ValidTo: [this._couponService.dateConvertGet(couponData.ValidTo), Validators.required],
                    DiscoutType: [couponData.DiscountType, Validators.required],
                    DiscountValue: [couponData.DiscountValue, Validators.required],
                    MaximumDeduction: [couponData.MaxDeductionAmount, Validators.required],
                    MaximumPurchase: [couponData.MinAmountToAvailDiscount, Validators.required]
                });
                let _self=this;
                setTimeout(() => {
                    Helpers.datepickerInit($('input[name="couponValidFrom"]'));
                    Helpers.datepickerInit($('input[name="couponValidTo"]'));
                    $('input[name="couponValidFrom"]').val(this._couponService.dateConvertGet(couponData.ValidFrom));
                    $('input[name="couponValidTo"]').val(this._couponService.dateConvertGet(couponData.ValidTo));

                    $('input[name="couponValidFrom"]').change(function(){
                        _self.createForm.controls['ValidFrom'].setValue($(this).val())
                    });
                    $('input[name="couponValidTo"]').change(function(){
                        _self.createForm.controls['ValidTo'].setValue($(this).val());
                    });
                }, 0);
                
            },
            error => {
                console.log("Some error tiggered" + error)
            });
    }

    update() {
        this.formError = true;
            if (!this.createForm.valid) {
                Helpers.DisplayMsg({ status: 'error', msg: 'Please fill all mandatory fields' })
            } else {
                Helpers.setLoading(true);
                this._couponService.couponUpdate(this.createForm.value, this.routeParams.CouponId).subscribe(
                    data => {
                        Helpers.setLoading(false);
                        Helpers.DisplayMsg(data)
                        this.formError = false;
                    },
                    error => {
                        Helpers.setLoading(false);
                        Helpers.DisplayMsg({ status: 'error', msg: 'Something when wrong.Please try later' })
                    });
            }
    }

    

}
