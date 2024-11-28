import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginDTO } from '../dtos/user/login.dto';
import { environment } from '../../environments/environment'
import { HttpUtilService } from './http.util.service';
import { DOCUMENT } from '@angular/common';
import { inject } from '@angular/core';
import { ApiResponse } from '../responses/api.response';
import { UserResponse } from '../responses/user/user.reponse';
import { GetDTO } from '../dtos/user/get.dto';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiRegister = `${environment.apiBaseUrl}/users/register`;
  private apiLogin = `${environment.apiBaseUrl}/auth/auth_account`;
  private apiChangePassword = `${environment.apiBaseUrl}/auth/change_password`;
  private apiUserDetail = `${environment.apiBaseUrl}/users/details`;

  private http = inject(HttpClient);
  private httpUtilService = inject(HttpUtilService);

  localStorage?: Storage;
  // createHeadersV1(): HttpHeaders {
  //   return new HttpHeaders({
  //     Authorization: `Bearer ${this.tokenService.getToken()}`,
  //     'Content-Type': 'application/json',
  //     'Accept-Language': 'vi',
  //   });
  // }
  // createHeadersV2(): HttpHeaders {
  //   return new HttpHeaders({
  //     Authorization: `Bearer ${this.tokenService.getToken()}`,
  //     'Accept-Language': 'vi',
  //   });
  // }
  // createHeadersV3(): HttpHeaders {
  //   return new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Accept-Language': 'vi',
  //   });
  // }
  private getHeadersContentType(): HttpHeaders {
    const token = this.tokenService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept-Language': 'vi',
      Authorization: `Bearer ${token}`,
    });
  }

  private getHeadersgNotAuth(): HttpHeaders {
    const token = this.tokenService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept-Language': 'vi'
    });
  }

  constructor(
    @Inject(DOCUMENT) private document: Document, private tokenService: TokenService
  ) {
    this.localStorage = document.defaultView?.localStorage;
  }

  //   register(registerDTO: RegisterDTO):Observable<ApiResponse> {
  //     return this.http.post<ApiResponse>(this.apiRegister, registerDTO, this.apiConfig);
  //   }

  login(loginDTO: LoginDTO): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.apiLogin, loginDTO, { headers :this.getHeadersgNotAuth() });
  }
  /*
  getUserDetail(token: string): Observable<ApiResponse> {
    //debugger
    return this.http.post<ApiResponse>(this.apiUserDetail, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    })
  }
  */
  getUserDetail(token: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.apiUserDetail, null, { headers: this.getHeadersContentType() });
  }

  //   updateUserDetail(token: string, updateUserDTO: UpdateUserDTO): Observable<ApiResponse>  {
  //     let userResponse = this.getUserResponseFromLocalStorage();        
  //     return this.http.put<ApiResponse>(`${this.apiUserDetail}/${userResponse?.id}`,updateUserDTO,{
  //       headers: new HttpHeaders({
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${token}`
  //       })
  //     })
  //   }
  saveUserResponseToLocalStorage(userResponse?: UserResponse) {
    try {
      //debugger
      if (userResponse == null || !userResponse) {
        return;
      }
      // Convert the userResponse object to a JSON string
      const userResponseJSON = JSON.stringify(userResponse);
      // Save the JSON string to local storage with a key (e.g., "userResponse")
      this.localStorage?.setItem('user', userResponseJSON);
      console.log('User response saved to local storage.');
    } catch (error) {
      console.error('Error saving user response to local storage:', error);
    }
  }
  getUserResponseFromLocalStorage(): UserResponse | null {
    try {
      // Retrieve the JSON string from local storage using the key
      const userResponseJSON = this.localStorage?.getItem('user');
      if (userResponseJSON == null || userResponseJSON == undefined) {
        return null;
      }
      // Parse the JSON string back to an object
      const userResponse = JSON.parse(userResponseJSON!);
      console.log('User response retrieved from local storage.');
      return userResponse;
    } catch (error) {
      console.error('Error retrieving user response from local storage:', error);
      return null; // Return null or handle the error as needed
    }
  }
  removeUserFromLocalStorage(): void {
    try {
      // Remove the user data from local storage using the key
      this.localStorage?.removeItem('user');
      console.log('User data removed from local storage.');
    } catch (error) {
      console.error('Error removing user data from local storage:', error);
      // Handle the error as needed
    }
  }
  getUsers(params: GetDTO): Observable<ApiResponse> {
    const url = `${environment.apiBaseUrl}/users`;
    const queryParams: any = { ...params };

    return this.http.get<ApiResponse>(url, { headers: this.getHeadersContentType(), params: queryParams });
  }

  resetPassword(userId: string, payload: any): Observable<ApiResponse> {
    const url = `${environment.apiBaseUrl}/users/reset_password_user?userId=${userId}`;
    return this.http.patch<ApiResponse>(url, payload, { headers: this.getHeadersContentType() });
  }

  addUser(payload: any): Observable<ApiResponse> {
    const url = `${environment.apiBaseUrl}/users`;
    return this.http.post<ApiResponse>(url, payload, { headers: this.getHeadersContentType() });
  }

  toggleUserStatus(params: { userId: number, enable: boolean }): Observable<ApiResponse> {
    const url = `${environment.apiBaseUrl}/users/block/${params.userId}/${params.enable ? '1' : '0'}`;
    return this.http.put<ApiResponse>(url, null, { headers: this.getHeadersContentType() });
  }

}
