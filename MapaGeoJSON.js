/*
API de Google Maps que cargue desde la máquina cliente un archivo en formato GeoJSON 
con la situación del inicio y de los hitos de las rutas turísticas 
construidas en la práctica de XML*/

//AIzaSyC8aUp4J8B-MOmk6mg4A8cSsbE3qzEpB1g
//Problemas de accesibilidad en el marco del mapa dinámico de Google Maps

class MapaDinamico {

  initMap() {
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: new google.maps.LatLng(43.362407, -6.159651),
      zoom: 10,
      mapTypeId: 'terrain'
    });
  }

  /**
   * Pinta las rutas sobre el mapa usando la clase PolyLine
   */
  initDrawing() {

    var puntos = []; //Crea un array de elementos LatLng
    //Formato coordenada geoJSON es (lng,lat): -6.069794,43.389283,55 
    this.coordinates.forEach(coordinate => {
      puntos.push(new google.maps.LatLng(coordinate[1], coordinate[0])) //Cogemos el primer y segundo elemento que corresponden a longitud y latitud respectivamente
    });

    var polyLinea = new google.maps.Polyline({
      path: puntos,
      map: this.map,
      strokeColor: 'ff0000ff',
      strokeWeight: 4,
    });
  }

  /**
   * Recorre las coordenadas de las rutas a
   * partir de las propiedades del objeto JSON
   * 
   * @param {File} archivo en formato geoJSON para ser procesado
   */
  procesaGeo(archivo) {
    this.coordinates = [];
    try {

      var archivoJSON = JSON.parse(archivo); //exception handling Try/catch(ES3)
      archivoJSON.features.forEach(feature => {
        feature.geometry.coordinates.forEach(coordinate => {
          this.coordinates.push(coordinate);
        });
      });
      this.initDrawing();
      //Limpia el campo "error" en caso de que exista
      if (document.getElementsByClassName("error").length > 0)//Si está presente el mensaje de error
        document.getElementsByClassName("error")[0].remove();

    } catch (error) {

      var errorElem = document.createElement("p");
      errorElem.setAttribute("class", "error");
      errorElem.innerText = "El archivo no está en formato geojson y no se puede representar";
      document.getElementById("map").before(errorElem);
      
    }

  }

  /**
   * Carga el archivo desde la máquina de cliente
   * Lee su contenido y lo envía como parámetro al 
   * método procesaKML
   * 
   * @param {*} files 
   */
  leerArchivoGeo(files) {
    var archivo = files[0];
    var lector = new FileReader();
    lector.onload = function (evento) {
      this.procesaGeo(lector.result);
    }.bind(this);
    lector.readAsText(archivo);
  }
}

var mapaDinamicoGoogle = new MapaDinamico();