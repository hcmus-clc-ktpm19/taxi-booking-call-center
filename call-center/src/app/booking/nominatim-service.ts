import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import { NominatimResponse } from '../shared/model/nominatim-response';
import {map} from 'rxjs/operators';
import {BASE_NOMINATIM_URL, DEFAULT_VIEW_BOX} from '../shared/constants';

const httpOptions = {
    headers: new HttpHeaders({ 'Access-Control-Allow-Origin': 'https://nominatim.openstreetmap.org' })
  };
  

@Injectable()
export class NominatimService {
  constructor(private http: HttpClient) {
  }

  addressLookup (req?: any): Observable<NominatimResponse[]> {
    let url = `https://${BASE_NOMINATIM_URL}/search?format=json&q=${req}`;
    return this.http
      .get<any>(url,httpOptions).pipe(
        map((data: any[]) => data.map((item: any) => new NominatimResponse(
          item.lat,
          item.lon,
          item.display_name
          ))
        )
      )
  }

}
