import { Injectable, ContentChild } from '@angular/core';
import { Observable, of, BehaviorSubject, config } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Credentials, CredentialsService } from './credentials.service';
import { map } from 'rxjs/operators';

export interface LoginContext {
  username: string;
  password: string;
}

/**
 * Provides a base for authentication workflow.
 * The login/logout methods should be replaced with proper implementation.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public currentUser: Observable<Credentials>;
  private currentUserSubject: BehaviorSubject<Credentials>;

  constructor(private credentialsService: CredentialsService, private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<Credentials>(JSON.parse(localStorage.getItem('credentials')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): Credentials {
    return this.currentUserSubject.value;
  }

  /**
   * Authenticates the user.
   * @param context The login parameters.
   * @return The user credentials.
   */
  login(context: LoginContext): Observable<Credentials> {
    const username = context.username;
    const password = context.password;

    return this.http
      .post<any>(`https://reqres.in/api/login`, { username, password })
      .pipe(
        map(user => {
          // login successful if there's a jwt token in the response
          if (user && user.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            this.credentialsService.setCredentials(user);
            this.currentUserSubject.next(user);
          }
          return user;
        })
      );
  }

  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfully.
   */
  logout(): Observable<boolean> {
    // Customize credentials invalidation here
    this.credentialsService.setCredentials();
    return of(true);
  }
}
