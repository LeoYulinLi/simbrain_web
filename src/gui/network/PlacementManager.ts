import LocatableModel from "../../model/network/interfaces/LocatableModel";
import paper from "paper";

export default class PlacementManager {

  private _lastClickLocation = new paper.Point(0, 0);

  private useLastClickLocation = true;

  private previousLocation = new paper.Point(0, 0);

  private anchorLocation = () => new paper.Point(0, 0);

  addLocatableModel(model: LocatableModel) {
    this.previousLocation = this.anchorLocation();
    if (this.useLastClickLocation) {
      model.coordinate = this.lastClickLocation;
      this.useLastClickLocation = false;
    } else {
      model.coordinate = this.anchorLocation().add(new paper.Point(45, 0));
    }
    this.anchorLocation = () => new paper.Point(model.coordinate);
  }

  get lastClickLocation(): paper.Point {
    return this._lastClickLocation;
  }

  set lastClickLocation(value: paper.Point) {
    this.useLastClickLocation = true;
    this._lastClickLocation = value;
  }


}
