import LocatableModel from "../../model/network/interfaces/LocatableModel";
import paper from "paper";
import NetworkModel from "../../model/network/interfaces/NetworkModel";

export default class PlacementManager {

  private _lastClickLocation = new paper.Point(0, 0);

  private useLastClickLocation = true;

  private previousLocation = new paper.Point(0, 0);

  private anchorLocation = () => new paper.Point(0, 0);

  addLocatableModel(model: LocatableModel): void {
    this.previousLocation = this.anchorLocation();
    if (this.useLastClickLocation) {
      model.coordinate = this.lastClickLocation;
      this.useLastClickLocation = false;
    } else {
      model.coordinate = this.anchorLocation().add(new paper.Point(45, 0));
    }
    this.anchorLocation = () => new paper.Point(model.coordinate);
  }

  pasteModels(models: NetworkModel[]): void {
    if (models.length === 0) return;

  }

  get lastClickLocation(): paper.Point {
    return this._lastClickLocation.clone();
  }

  set lastClickLocation(value: paper.Point) {
    this.useLastClickLocation = true;
    this._lastClickLocation = value;
  }


}
