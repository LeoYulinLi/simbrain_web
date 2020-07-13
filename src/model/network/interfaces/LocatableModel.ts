import { Emitter } from "../../../events/emitter";
import { Coordinate } from "../../../utils/geom";

interface LocatableModel {

  coordinate: Coordinate

  events: Emitter<{ location: Coordinate }>

}

export default LocatableModel;
