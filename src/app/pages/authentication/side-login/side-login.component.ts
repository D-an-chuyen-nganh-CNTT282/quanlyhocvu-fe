import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  NgForm,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { MatButtonModule } from '@angular/material/button';
import { BaseComponent } from 'src/app/components/base/base.component';
import { LoginDTO } from 'src/app/dtos/user/login.dto';
import { ApiResponse } from 'src/app/responses/api.response';
import { UserResponse } from 'src/app/responses/user/user.reponse';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-side-login',
  standalone: true,
  imports: [
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent extends BaseComponent implements OnInit {
  @ViewChild('loginForm') loginForm!: NgForm;  
  // admin@gmail.com	Admin123.	Admin
  // tk@gmail.com	Tk12345.	Trưởng khoa
  // gvk@gmail.com	Gvk1234.	Giáo vụ khoa
  // ptk@gmail.com	Ptk1234.	Phó trưởng khoa
  // gv@gmail.com	Gv12345.	Giảng viên
  // tbm@gmail.com	Tbm1234.	Trưởng bộ môn
  email: string = 'tk@gmail.com';
  password: string = 'Tk12345.';
  userResponse?: UserResponse
  
  constructor() {
    super();
  }
  ngOnInit(): void {
  }

  form = new FormGroup({
    uname: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password: new FormControl('', [Validators.required]),
  });

  login() {
    const loginDTO: LoginDTO = {
      email: this.email,
      password: this.password,
      // role_id: this.selectedRole?.id ?? 1
    };
    this.tokenService.setToken('accessToken');
    this.userService.login(loginDTO).subscribe({
      next: (apiResponse: ApiResponse) => {
        const { accessToken } = apiResponse.data;
        this.tokenService.setToken(accessToken);
        this.userResponse = {...apiResponse.data.user}
        this.userService.saveUserResponseToLocalStorage(this.userResponse);
        this.router.navigate(['/dashboard']);
        // this.selectedRole = roles.length > 0 ? roles[0] : undefined;
      },
      error: (error: HttpErrorResponse) => {
        console.error(error?.error?.message ?? '');
      }
    });  
  }
}
