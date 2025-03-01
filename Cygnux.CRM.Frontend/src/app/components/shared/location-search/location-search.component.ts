import { Component, EventEmitter, Input, input, OnInit, Output } from '@angular/core';
import { MapLocationResponse } from '../../../shared/models/location.model';

declare var google: any;

@Component({
  selector: 'app-location-search',
  templateUrl: './location-search.component.html',
})
export class LocationSearchComponent implements OnInit {
  @Output() mapDataEmitter: EventEmitter<MapLocationResponse> =
    new EventEmitter<MapLocationResponse>();
  @Input() meetingResponse:any;
  ngOnInit(): void {
    const placeSearch = new PlacesSearch('searchInput', 'suggestionsList');
    placeSearch.initialize();

    // Example: Consume the class to get lat, long, and address
    placeSearch.eventCompleted.subscribe((value) => {
      this.mapDataEmitter.emit(value);
    });
  }
}

class PlacesSearch {
  private autocompleteService: google.maps.places.AutocompleteService;
  private placesService!: google.maps.places.PlacesService;
  private inputElement: HTMLInputElement;
  private suggestionsList: HTMLUListElement;
  public eventCompleted = new EventEmitter<MapLocationResponse>();

  constructor(inputId: string, listId: string) {
    this.inputElement = document.getElementById(inputId) as HTMLInputElement;
    this.suggestionsList = document.getElementById(listId) as HTMLUListElement;
    this.autocompleteService = new google.maps.places.AutocompleteService();
  }

  public initialize(): void {
    if (!this.inputElement || !this.suggestionsList) {
      console.error('Input field or suggestions list not found!');
      return;
    }

    // Add event listener to the input field
    this.inputElement.addEventListener('input', () => {
      const query = this.inputElement.value.trim();

      // Check if input length is >= 2
      if (query.length >= 2) {
        this.getPlaceSuggestions(query);
      } else {
        this.clearSuggestions();
      }
    });
  }
  private getPlaceSuggestions(query: string): void {
    this.autocompleteService.getPlacePredictions(
      {
        input: query,
        componentRestrictions: { country: 'IN' }, // Restrict to India
        types: ['establishment', 'geocode'], // Adjust type if needed (e.g., "establishment")
      },
      (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK &&predictions) {
          this.renderSuggestions(predictions);
        } else {
          console.error('AutocompleteService failed: ', status);
          this.clearSuggestions();
        }
      }
    );
  }

  public getPlaceDetails(placeId: string): void {
    if (!this.placesService) {
      // Initialize PlacesService with a dummy map element
      const map = document.createElement('div');
      this.placesService = new google.maps.places.PlacesService(map);
    }

    this.placesService.getDetails({ placeId: placeId }, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && place) {
        const details: MapLocationResponse = {
          lat: place.geometry?.location?.lat() || 0,
          lng: place.geometry?.location?.lng() || 0,
          address: place.formatted_address || 'No address available',
        };
        this.eventCompleted.emit(details);
      }
    });
  }

  private renderSuggestions(
    predictions: google.maps.places.AutocompletePrediction[]
  ): any {
    this.clearSuggestions();

    predictions.forEach((prediction) => {
      const listItem = document.createElement('li');
      listItem.textContent = prediction.description;
      listItem.style.padding = '5px';
      listItem.style.cursor = 'pointer';

      // Add click event to list item
      listItem.addEventListener('click', () => {
        this.inputElement.value = prediction.description;
        this.clearSuggestions();

        this.getPlaceDetails(prediction.place_id);
      });

      this.suggestionsList.appendChild(listItem);
    });
  }

  private clearSuggestions(): void {
    this.suggestionsList.innerHTML = '';
  }
}
