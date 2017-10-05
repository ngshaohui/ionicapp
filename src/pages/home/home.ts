import { Component } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import L from 'leaflet';

import { MapService } from '../map/map.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  center: any;
  map: any;
  maps: any;
  testdata: any;

  constructor(
    public alertCtrl: AlertController,
    public mapService: MapService,
    public navCtrl: NavController,
    private geolocation: Geolocation
  ) {
    // Could load night map if app used at night
    this.maps = {
      osm: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      default: "https://maps-{s}.onemap.sg/v3/Default/{z}/{x}/{y}.png",
      night: "https://maps-{s}.onemap.sg/v3/Night/{z}/{x}/{y}.png"
    }
  }

  ngOnInit(): void {
    this.initMap();
    // this.initTestData();
    // this.addFeatureToMap(this.testdata);
  }

  ionViewDidEnter() {
        if (!this.mapService.route) {
          this.showGeneratePrompt();
        } else {
          let colourMap: string[] = ["#F0F7D4", "#B2D732", "#FE2712", "#347B98", "#092834"];
          //for (let i in this.mapService.route) {
            this.addFeatureToMap(this.mapService.route[0], colourMap[3]);
          //}
          //geotracker
          this.geolocation.getCurrentPosition().then((resp) => {
            // resp.coords.latitude
            // resp.coords.longitude
            // console.log(resp.coords);
            this.map.panTo(new L.LatLng(resp.coords.latitude, resp.coords.longitude));
          }).catch((error) => {
            console.log('Error getting location', error);
          });

          let watch = this.geolocation.watchPosition();
          watch.subscribe((data) => {
            // data can be a set of coordinates, or an error (if an error occurred).
            // data.coords.latitude
            // data.coords.longitude
          });
        }
  }


    addFeatureToMap(geojsonFeature, route_color): void {
      let feature = L.geoJSON(geojsonFeature, {
        color: route_color,
        weight: 5
      });
      feature.addTo(this.map);
      this.map.fitBounds(feature.getBounds());
    }

  initMap(): void {
    // From OneMap API docs
    this.center = L.bounds([1.56073, 104.11475], [1.16, 103.502]).getCenter();
    this.map = L.map('navmap').setView([this.center.x, this.center.y], 12);
    let basemap = L.tileLayer(this.maps.default, {
      detectRetina: true,
      attribution: 'Map data © contributors, <a href="http://SLA.gov.sg">Singapore Land Authority</a>',
      maxZoom: 18,
      minZoom: 11
    });

    let attribution = this.map.attributionControl;
    attribution.setPrefix('<img src="https://docs.onemap.sg/maps/images/oneMap64-01.png" style="height:20px;width:20px;" />');
    this.map.setMaxBounds([[1.56073, 104.1147], [1.16, 103.502]]);
    basemap.addTo(this.map);
  }

  showGeneratePrompt() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Generate a route first');

    alert.addButton({
      text: 'Ok',
      handler: (data: any) => {
      }
    });

    alert.present();
  }

  initTestData(): void {
    this.testdata = {
      //possible route 1
      "type": "FeatureCollection",
      "features": [
        {
          //route from input start_point to input end_point passing through PCN
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "LineString",
            "coordinates": [
              [
                103.75810146331787,
                1.3558373881163897
              ],
              [
                103.76561164855957,
                1.3642142485807298
              ],
              [
                103.76797199249268,
                1.3630665882398767
              ]
            ]
          }
        },
        {
          //entry point to incorporated PCN
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Point",
            "coordinates": [
              103.75878810882568,
              1.356384405499368
            ]
          }
        },
        {
          //exit point of incorporated PCN
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Point",
            "coordinates": [
              103.76498937606812,
              1.363463442812161
            ]
          }
        }
      ]
    }
  }

}
