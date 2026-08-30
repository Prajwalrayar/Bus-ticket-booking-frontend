import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, switchMap, throwError } from 'rxjs';
import { Login } from '../models/login';
import { User } from '../models/user';
import { Register } from '../models/register';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  login(loginData: Login): Observable<User | null> {

    const params = new HttpParams()
      .set('email', loginData.email)
      .set('password', loginData.password);

    return this.http
      .get<User[]>(this.apiUrl, { params })
      .pipe(
        map(users => users.length > 0 ? users[0] : null)
      );
  }
  

  register(registerData: Register): Observable<User> {

    const params = new HttpParams()
      .set('email', registerData.email);

    return this.http
      .get<User[]>(this.apiUrl, { params })
      .pipe(

        switchMap(users => {

          if (users.length > 0) {

            return throwError(
              () => new Error('Email already registered')
            );
          }

          const newUser: Omit<User, 'id'> = {

            name: registerData.name,
            email: registerData.email,
            phone: registerData.phone,
            password: registerData.password,
            role: 'PASSENGER'

          };

          return this.http.post<User>(
            this.apiUrl,
            newUser
          );

        })

      );
  }
}
