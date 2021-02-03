// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpComponent {

  email = new FormControl('');
  fullName = new FormControl('');
  phoneNumber =  new FormControl('');

  private busy_ = new BehaviorSubject(false);
  public busy = this.busy_.asObservable();

  private errorMessage_ = new BehaviorSubject('');
  public errorMessage = this.errorMessage_.asObservable();

  constructor(private router: Router, private auth: AuthService) { }

  public async signup() {
    this.errorMessage_.next('');
    this.busy_.next(true);
    try {
      await this.auth.signUp({
        email: this.email.value,
        fullName: this.fullName.value,
        phoneNumber: this.phoneNumber.value
      });
      const challenge = await this.auth.signIn(this.email.value);
      if (challenge === "CHOOSE_EMAIL_OR_SMS") {
        this.router.navigate(['/choose-email-or-sms']);
      } else {
        this.router.navigate(['/enter-secret-code']);
      }
    } catch (err) {
      console.log(err);
      this.errorMessage_.next(err.message || err);
    } finally {
      this.busy_.next(false);
    }
  }
}
