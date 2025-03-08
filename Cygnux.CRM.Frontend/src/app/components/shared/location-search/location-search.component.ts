import { Component, ElementRef, EventEmitter, Input, input, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MapLocationResponse } from '../../../shared/models/location.model';
import { MeetingService } from '../../../shared/services/meeting.service';
import { Subscription } from 'rxjs';

declare var google: any;

@Component({
  selector: 'app-location-search',
  templateUrl: './location-search.component.html',
})
export class LocationSearchComponent implements OnInit ,OnDestroy{
  @Output() mapDataEmitter: EventEmitter<MapLocationResponse> = new EventEmitter<MapLocationResponse>();
  @Input() meetingResponse: any = {}; 
  @ViewChild('searchInput', { static: false }) searchInput!: ElementRef;
  @ViewChild('suggestionsList', { static: false }) suggestionsList!: ElementRef;
  private placeSearch!: PlacesSearch;
  private resetLocationSearchSubscription!:Subscription;
  constructor(private meetingService: MeetingService){
    this.resetLocationSearchSubscription = this.meetingService.resetLocationSearch.subscribe((res)=>{
      if(res){
        this.resetSearch();
      }
    })
  }
  
  ngOnInit(): void {
   if (!this.meetingResponse) {
      this.meetingResponse = ''; 
    }
  }
  ngAfterViewInit(): void {
    if (this.searchInput && this.suggestionsList) {
      this.initializePlaceSearch();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.searchInput && this.suggestionsList) {
      this.initializePlaceSearch();
    }
  }

   private initializePlaceSearch(): void {
    if (!this.searchInput?.nativeElement || !this.suggestionsList?.nativeElement) {
      console.error('Search input or suggestions list is not available');
      return;
    }

    this.placeSearch = new PlacesSearch(this.searchInput.nativeElement, this.suggestionsList.nativeElement);
    this.placeSearch.initialize();

    this.placeSearch.eventCompleted.subscribe((value) => {
      this.meetingResponse = value.address;
      this.mapDataEmitter.emit(value);
    });
  }

   resetSearch(): void {
    if (this.meetingResponse) {this.meetingResponse = ''}
    if (this.searchInput) {this.searchInput.nativeElement.value = ''}
    if (this.suggestionsList) { this.suggestionsList.nativeElement.innerHTML = ''}
  }

  ngOnDestroy(): void {
    if(this.resetLocationSearchSubscription){this.resetLocationSearchSubscription.unsubscribe()}
  }
}

class PlacesSearch {
  private autocompleteService: google.maps.places.AutocompleteService;
  private placesService!: google.maps.places.PlacesService;
  private inputElement: HTMLInputElement;
  private suggestionsList: HTMLUListElement;
  public eventCompleted = new EventEmitter<MapLocationResponse>();

    constructor(inputElement: HTMLInputElement, listElement: HTMLUListElement) {
    this.inputElement = inputElement;
    this.suggestionsList = listElement;
    this.autocompleteService = new google.maps.places.AutocompleteService();
  }

  public initialize(): void {
    if (!this.inputElement || !this.suggestionsList) {
      console.error('Input field or suggestions list not found!');
      return;
    }

    this.inputElement.addEventListener('input', () => {
      const query = this.inputElement.value.trim();

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
