import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ApiServiceService } from '../../_services/api-service/api-service.service';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css'],
})
export class RegistrationFormComponent implements OnInit {
  public formSubmitted = false;
  public loading = false;
  public alert = false;
  public alertMessageText = '';
  public alertClass = '';
  errorClass = 'alert alert-danger';
  successClass = 'alert alert-success alert-dismissible fade show';

  public regionList = [];

  private emailRegex: string =
    "^([a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9]))$";
  private mobilephoneRegex: string = '^[1-9]{1}[0-9]{9}$';
  private otpRegex: string = '^[0-9]{4}$';
  private pincodeRegex: string = '^[1-9][0-9]{5}$';
  private ageRegex = '^[1-9][0-9]{0,2}$';

  public registrationForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    gender: new FormControl('', [Validators.required]),
    age: new FormControl('', [
      Validators.required,
      Validators.pattern(this.ageRegex),
    ]),
    mobile: new FormControl('', [
      Validators.required,
      Validators.pattern(this.mobilephoneRegex),
      Validators.maxLength(10),
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(this.emailRegex),
    ]),
    otp: new FormControl('', [
      Validators.required,
      Validators.pattern(this.otpRegex),
    ]),
    pincode: new FormControl('', [
      Validators.required,
      Validators.pattern(this.pincodeRegex),
    ]),
    leader_ref_code: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
    ]),
    region_id: new FormControl('', [Validators.required]),
  });

  constructor(public apiService: ApiServiceService) {}

  ngOnInit(): void {
    this.getRegions();
  }

  getRegions() {
    this.apiService.getRegions().subscribe((response: any) => {
      this.regionList = response.regionData;
    });
  }

  async submitRegistration() {
    this.formSubmitted = true;
    if (this.registrationForm.valid) {
      this.loading = true;
      let data = this.registrationForm.value;
      try {
        let response = await (<any>(
          this.apiService.registration(data).toPromise()
        ));
        if (response.status === 'success') {
          this.registrationForm.reset();

          this.loading = false;
          this.alert = true;
          this.alertClass = this.successClass;
          this.alertMessageText = response.msg;
        } else {
          this.alert = true;
          this.alertClass = this.errorClass;
          this.alertMessageText = response.msg;
        }
      } catch (error) {
        this.alert = true;
        this.alertClass = this.errorClass;
        this.alertMessageText = error.error.msg;
      }
      this.loading = false;
    }
  }
}
