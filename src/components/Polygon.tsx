import { useEffect, useRef, useState } from "react";

interface MarkersType {
  lat: number;
  lng: number;
}


function Poliline() {
  const [map, setMap] = useState<google.maps.Map>()
  const ref = useRef<HTMLDivElement>()
  const [polyPaths, setPolyPaths] = useState<MarkersType[]>([])
  const [marker, setMarkers] = useState<MarkersType | undefined | google.maps.Marker>();
  const [handlerMarker, setHandlerMarker] = useState<boolean>(false)
  const [markersArray, setMarkersArray] = useState<MarkersType[]>([])
  const [allMarkersArray, setAllMarkersArray] = useState<google.maps.Marker[]>([])

  const [polygonCreate, setPolygonCreate] = useState<boolean>(false)



  useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.maps.Map(ref.current, {
        center: { lat: 47.0036705, lng: 28.907089 },
        zoom: 8,
      }))
    }

    if (map) {
      map.addListener("click", (event: { latLng: google.maps.LatLng; }) => {
        addLatLngToPoly(event.latLng, poly);
      });
      const poly = new google.maps.Polyline({
        strokeColor: "#000000",
        strokeOpacity: 1,
        strokeWeight: 3,
        map: map,
      });
    }
  }, [map])

  useEffect(() => {
    if (polygonCreate) {
      const polygon = new google.maps.Polygon({
        paths: markersArray,
        strokeColor: "#000000",
        strokeOpacity: 1,
        strokeWeight: 3,
        editable: true,
        draggable: true
      });

      polygon.setMap(map)

      setMarkersArray([])
      setPolygonCreate(false)

      polygon.getPaths().forEach(function (path, ind: number) {

        google.maps.event.addListener(path, 'insert_at', function (index: number, oldLatLng) {

          const polygonBounds = path;
          const point = {
            lat: polygonBounds.getAt(index).lat(),
            lng: polygonBounds.getAt(index).lng()
          };
          markersArray[ind] = { lat: polygonBounds.getAt(index).lat(), lng: polygonBounds.getAt(index).lng() }

          const marker = new google.maps.Marker({
            position: point,
            map: map,
            draggable: true,
          });

          let indexOfPath = -1

          marker.addListener("dragstart", (event: { latLng: google.maps.LatLng; }) => {
            const arr = path.getArray();
            arr.forEach((a, index: number) => {

              if (a.toJSON().lat === event.latLng.toJSON().lat && a.toJSON().lng === event.latLng.toJSON().lng) {
                indexOfPath = index
              }
            })
          })

          marker.addListener("dragend", (event: { latLng: google.maps.LatLng; }) => {
            if (indexOfPath > -1) {
              path.setAt(indexOfPath, event.latLng);
            }
          })

          const markerPath: google.maps.Marker = marker.getPosition()

          setAllMarkersArray(prevMark => [
            ...prevMark, markerPath
          ])
          setPolyPaths(prevMark => [
            ...prevMark, point
          ])

          setMarkers(marker)

        });
      });
    }

  }, [map, polygonCreate, polyPaths, handlerMarker, markersArray])

  function addLatLngToPoly(
    latLng: google.maps.LatLng,
    poly: google.maps.Polyline
  ) {
    const path = poly.getPath();

    const marker = new google.maps.Marker({
      position: latLng,
      title: '#' + path.getLength(),
      map: map,
      draggable: true,
    });

    const mark: MarkersType = marker.getPosition()?.toJSON()
    const markerPath: google.maps.Marker = marker.getPosition()

    if (marker) {
      setMarkersArray(prevMark => [
        ...prevMark, mark
      ])

      setAllMarkersArray(prevMark => [
        ...prevMark, markerPath
      ])

      setPolyPaths(prevMark => [
        ...prevMark, mark
      ])
    }

    path.push(latLng);
    let index = -1;

    function createPolygonEvent(event: { latLng: google.maps.LatLng; }) {
      const arr: google.maps.LatLng[] = path.getArray();
      index = arr.indexOf(event.latLng);
      if (index === 0) {
        setPolygonCreate(true)
      }
      path.clear()
    }
    const createPoly = marker.addListener('click', createPolygonEvent);
    google.maps.event.clearListeners(createPoly, 'click');
  }


  return (
    <>
      <div ref={ref as never} style={{ height: "100%", width: "1300px", minHeight: "620px" }} >
      </div>
    </>
  )
}

export default Poliline
