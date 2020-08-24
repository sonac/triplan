import * as React from "react";
import DeckGL from "deck.gl";
import { StaticMap } from "react-map-gl";
import { PathLayer } from "@deck.gl/layers";

import "mapbox-gl/dist/mapbox-gl.css";

const TOKEN = process.env.REACT_APP_DECK_TOKEN;

export default (props) => {
  const data = [
    {
      name: "random-name",
      color: [255, 107, 0],
      path: props.path,
    },
  ];
  const layer = [
    new PathLayer({
      id: "path-layer",
      data,
      getWidth: () => 3,
      getColor: (d: any) => d.color,
      widthMinPixels: 3,
    }),
  ];

  return (
    <DeckGL
      initialViewState={{
        longitude: props.path[0][0],
        latitude: props.path[0][1],
        zoom: 12,
      }}
      controller={true}
      layers={layer} // layer here
      style={{ position: "relative", width: "25vw", height: "25vw" }}
    >
      <StaticMap
        mapStyle="mapbox://styles/mapbox/dark-v10"
        mapboxApiAccessToken={TOKEN}
      />
    </DeckGL>
  );
};
