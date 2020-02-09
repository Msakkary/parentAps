import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpService } from '@app/core';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  constructor(private http: HttpService) {}
  /**
   * Fetch users from server
   * @param pageNumber desired page.
   * @return observables of fetched data.
   */
  getUserbyPageNumber(pageNumber: number): Observable<any> {
    return this.http
      .get(`https://reqres.in/api/users?page=${pageNumber}`)
      .pipe(catchError(() => of('Error, No Users were fetched')));
  }
}
