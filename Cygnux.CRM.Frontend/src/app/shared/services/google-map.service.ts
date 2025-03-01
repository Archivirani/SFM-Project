// google-maps-loader.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GoogleMapsLoaderService {
  private isLoaded = false;

  loadGoogleMapsAPI(apiKey: string): Promise<void> {
    if (this.isLoaded) {
      return Promise.resolve(); // Already loaded
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        this.isLoaded = true;
        resolve();
      };

      script.onerror = (error) => {
        console.error('Error loading Google Maps API:', error);
        reject(error);
      };

      document.body.appendChild(script);
    });
  }
}
