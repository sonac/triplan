import * as React from "react";
import { useState } from "react";
import DeckGL from "deck.gl";
import { StaticMap } from "react-map-gl";
import { PathLayer } from "@deck.gl/layers";

import "mapbox-gl/dist/mapbox-gl.css";

const TOKEN =
  "pk.eyJ1Ijoic29uYWMiLCJhIjoiY2s4MjM0amJoMDI4aTNnbzRqY3R0c3hqOCJ9.Wq8z3oRGCEjfddpHRQ92JA";

export default props => {
  const data = [
    {
      name: "random-name",
      color: [101, 147, 245],
      path: props.path
    }
  ];
  const [viewport, setViewPort] = useState({
    width: "100%",
    height: 900,
    latitude: 0,
    longitude: 0,
    zoom: 2
  });
  const layer = [
    new PathLayer({
      id: "path-layer",
      data,
      getWidth: data => 7,
      getColor: data => data.color,
      widthMinPixels: 7
    })
  ];

  console.log(data);
  return (
    <DeckGL
      initialViewState={{
        longitude: props.path[0][0],
        latitude: props.path[0][1],
        zoom: 12
      }}
      controller={true}
      layers={layer} // layer here
      style={{ position: "relative", width: "30vw", height: "30vw" }}
    >
      <StaticMap
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxApiAccessToken={TOKEN}
      />
    </DeckGL>
  );
};
