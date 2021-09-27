import React from "react";
import ReactDom from "react-dom";
//@ts-ignore
import reactToWebComponent from "react-to-webcomponent";
import { PropertyTile, PlayerState } from "../.rtag/types";

function PropertyTileComponent({ val, state }: { val: PropertyTile; state: PlayerState }) {
  const posIdx = state.board.findIndex((tile) => tile.name === val.name);
  return (
    <div style={{ float: "left", width: 150, height: 250, textAlign: "center", border: "1px white solid" }}>
      <div style={{ height: 70, marginBottom: 10, fontSize: 18, fontWeight: "bold", backgroundColor: val.color }}>
        <div>{val.name}</div>
        <div style={{ fontSize: 12 }}>Owner: {val.owner}</div>
      </div>
      <div>Price: ${val.price}</div>
      <div>Rent: ${val.rent}</div>
      <hr />
      {state.players
        .filter((p) => p.position === posIdx)
        .map((p) => (
          <div key={p.name}>{p.name}</div>
        ))}
    </div>
  );
}

export default reactToWebComponent(PropertyTileComponent, React, ReactDom);
