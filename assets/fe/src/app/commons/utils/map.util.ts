/**
 * A customized popup on the map.
 * https://developers.google.com/maps/documentation/javascript/examples/overlay-popup#maps_overlay_popup-typescript
 */
import { httpHandler } from "src/app/commons/utils/helper.util";

interface Options {
  containerClass?: string
}
export class MapPopover extends google.maps.OverlayView {
  position: google.maps.LatLng;
  containerDiv: HTMLDivElement;

  constructor(position: google.maps.LatLng, content: HTMLElement, options: Options = {}) {
    super();
    const { containerClass = ""} = options;
    this.position = position;

    content.classList.add('popup-bubble');

    // This zero-height div is positioned at the bottom of the bubble.
    const bubbleAnchor = document.createElement('div');

    bubbleAnchor.classList.add('popup-bubble-anchor');
    bubbleAnchor.appendChild(content);

    // This zero-height div is positioned at the bottom of the tip.
    this.containerDiv = document.createElement('div');
    this.containerDiv.className = `popup-container ${containerClass}`;
    this.containerDiv.appendChild(bubbleAnchor);

    // Optionally stop clicks, etc., from bubbling up to the map.
    MapPopover.preventMapHitsAndGesturesFrom(this.containerDiv);
  }

  /** Called when the popup is added to the map. */
  onAdd() {
    this.getPanes()!.floatPane.appendChild(this.containerDiv);
  }

  /** Called when the popup is removed from the map. */
  onRemove() {
    if (this.containerDiv.parentElement) {
      this.containerDiv.parentElement.removeChild(this.containerDiv);
    }
  }

  /** Called each frame when the popup needs to draw itself. */
  draw() {
    const divPosition = this.getProjection().fromLatLngToDivPixel(
      this.position
    )!;

    // Hide the popup when it is far out of view.
    const display =
      Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000
        ? 'block'
        : 'none';

    if (display === 'block') {
      this.containerDiv.style.left = divPosition.x + 'px';
      this.containerDiv.style.top = divPosition.y + 'px';
    }

    if (this.containerDiv.style.display !== display) {
      this.containerDiv.style.display = display;
    }
  }
}

// Usage

//   popup = new Popup(
//     new google.maps.LatLng(-33.866, 151.196),
//     document.getElementById("content") as HTMLElement
//   );
//   popup.setMap(map);


export const formatPlaceAddress = (place: google.maps.places.PlaceResult)=>{
  return place.name === place.vicinity ? place.name : `${place.vicinity}, ${place.name}` 
}

export const grayStyles = [
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#e9e9e9"
            },
            {
                "lightness": 17
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f5f5f5"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 17
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 29
            },
            {
                "weight": 0.2
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 18
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f5f5f5"
            },
            {
                "lightness": 21
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#dedede"
            },
            {
                "lightness": 21
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#ffffff"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "saturation": 36
            },
            {
                "color": "#333333"
            },
            {
                "lightness": 40
            }
        ]
    },
    {
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f2f2f2"
            },
            {
                "lightness": 19
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#fefefe"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#fefefe"
            },
            {
                "lightness": 17
            },
            {
                "weight": 1.2
            }
        ]
    }
]



const placeQueryPromise = (q: string) => {
    return new Promise<any>((res,rej)=>{
        const service = new google.maps.places.AutocompleteService();
    
        service.getQueryPredictions({ input: q }, (response,status)=>{
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                if (response) {
                    res(response)
                }
            } else {
                rej(status)
            }
            
        });
    }) 
} 

export const placeQuery =httpHandler<google.maps.places.AutocompletePrediction[]>({
    initialData: [],
    handler: (state)=>{
        return async (q)=>{
            const [res,err] =  await state.handle(placeQueryPromise(q)) 
            if (!err) {
                state.data = res as google.maps.places.AutocompletePrediction[];
            }
        }
    }
}) 


export const makeMarker = (imageUrl: string,options?: google.maps.MarkerOptions)=>{
    return new google.maps.Marker({
        icon: {
            url: imageUrl,
            scaledSize: new google.maps.Size(30,30),
            anchor: new google.maps.Point(15,15),
        },
        ...options
    })
}

export const OriginMarker = (options?: google.maps.MarkerOptions)=> makeMarker("/static/images/illu/origin.png",options)  
export const DestinationMarker = (options?: google.maps.MarkerOptions)=> makeMarker("/static/images/illu/destination.png",options)  
export const CarMarker = (options?: google.maps.MarkerOptions)=> {
    return new google.maps.Marker({
        icon: {
            url: "/static/images/illu/ride_car.png",
            scaledSize: new google.maps.Size(80,80),
            anchor: new google.maps.Point(40,40),
        },
        ...options
    })
} 





// QUery helper

export async function getPlaceByLatLng(lat: any, lng: any) {
    const geocoder = new google.maps.Geocoder();
    return geocoder.geocode({ location: {lat, lng} })
    .then((resp) => {
        return resp.results[0]
    });
}