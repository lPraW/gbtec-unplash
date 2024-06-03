import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UnplashResponse } from '../../models/unplash-response';

@Injectable({
  providedIn: 'root'
})
export class UnplashService {

  apiRoute: string = 'https://api.unsplash.com/search/photos?client_id=dkUW3LIQR-MNTUzW0T9mTIIvG72u1ftIX4L04P8YjTQ';

  constructor(private http: HttpClient) { }

  searchPhotos(query: string, page: number): Observable<UnplashResponse> {
    const params = new HttpParams()
      .set('query', query)
      .set('page', page.toString())

    return this.http.get<UnplashResponse>(this.apiRoute, {params});
  }
}
