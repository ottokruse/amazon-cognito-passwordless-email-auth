// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { AuthService } from '../auth.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInComponent {

  public emailOrPhoneNumber = new FormControl('');

  private busy_ = new BehaviorSubject(false);
  public busy = this.busy_.asObservable();

  private errorMessage_ = new BehaviorSubject('');
  public errorMessage = this.errorMessage_.asObservable();

  constructor(private router: Router, private auth: AuthService) { }

  public async signIn() {
    this.busy_.next(true);
    this.errorMessage_.next('');
    try {
      const challenge = await this.auth.signIn(this.emailOrPhoneNumber.value);
      if (challenge === "CHOOSE_EMAIL_OR_SMS") {
        this.router.navigate(['/choose-email-or-sms']);
      } else {
        this.router.navigate(['/enter-secret-code']);
      }
    } catch (err) {
      this.errorMessage_.next(err.message || err);
    } finally {
      this.busy_.next(false);
    }
  }
}
