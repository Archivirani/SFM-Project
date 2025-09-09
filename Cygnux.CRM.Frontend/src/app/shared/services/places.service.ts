// places.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private apiKey = 'AIzaSyBmRFFqodANbo8fCNVT73Mp7T_lZ8x5VJs'; // 🔑 replace with env variable ideally
  private baseUrl = 'https://places.googleapis.com/v1';

  constructor(private http: HttpClient) {}

  // 🔹 Autocomplete (new REST API)
  getAutocompleteSuggestions(input: string): Observable<any> {
    const url = `${this.baseUrl}/places:autocomplete`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': this.apiKey,
      'X-Goog-FieldMask':
        'suggestions.placePrediction.placeId,suggestions.placePrediction.text.text,suggestions.placePrediction.structuredFormat.mainText.text,suggestions.placePrediction.structuredFormat.secondaryText.text',
    });

    const body = {
      input,
      languageCode: 'en',
      locationBias: {
        rectangle: {
          low: { latitude: 8.0, longitude: 68.0 },
          high: { latitude: 37.0, longitude: 97.0 },
        },
      },
    };

    return this.http.post(url, body, { headers });
  }

//  getAutocompleteSuggestions(input: string): Observable<any> {
//     const url = `${this.baseUrl}/places:autocomplete`;

//     const headers = new HttpHeaders({
//       'Content-Type': 'application/json',
//       'X-Goog-Api-Key': this.apiKey,
//       'X-Goog-FieldMask':
//         'suggestions.placePrediction.placeId,' +
//         'suggestions.placePrediction.text.text,' +
//         'suggestions.placePrediction.structuredFormat.mainText.text,' +
//         'suggestions.placePrediction.structuredFormat.secondaryText.text',
//     });

//     const body = {
//       input,
//       languageCode: 'en',
//       locationBias: {
//         rectangle: {
//           low: { latitude: 8, longitude: 68 },
//           high: { latitude: 37, longitude: 97 },
//         },
//       },
//     };

//     return this.http.post(url, body, { headers });
//   }

  // 🔹 Place Details (new REST API)
  getPlaceDetails(placeId: string): Observable<any> {
    const url = `${this.baseUrl}/places/${placeId}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': this.apiKey,
      'X-Goog-FieldMask':
        'id,displayName,formattedAddress,location',
    });

    return this.http.get(url, { headers });
  }

//  getPlaceDetails(placeId: string): Observable<any> {
//     const url = `${this.baseUrl}/places/${placeId}`;

//     const headers = new HttpHeaders({
//       'Content-Type': 'application/json',
//       'X-Goog-Api-Key': this.apiKey,
//       'X-Goog-FieldMask': 'id,displayName,formattedAddress,location',
//     });

//     return this.http.get(url, { headers });
//   }
}
