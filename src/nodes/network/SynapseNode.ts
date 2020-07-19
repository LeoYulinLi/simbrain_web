import ScreenElement from "./ScreenElement";
import { Synapse } from "../../model/network/Synapse";
import paper from "paper";
import eventEmitter from "../../events/emitter";
import clamp from "lodash.clamp";

export default class SynapseNode extends ScreenElement {

  private line = new paper.Path({
    strokeWidth: 1,
    strokeColor: "#00000033",
    insert: false
  });

  private indicator = new paper.Shape.Circle({
    center: [0, 0],
    radius: 3,
    fillColor: "red",
    closed: true,
    insert: false
  });

  readonly events = eventEmitter<{
    selected: any
  }>()

  private nodeHandle = new paper.Shape.Rectangle({
    size: this.indicator.bounds.size,
    insert: false,
    visible: false
  });

  readonly node = new paper.Group();

  private selected = false;

  constructor(readonly synapse: Synapse) {
    super();
    this.node.addChild(this.line);
    this.node.addChild(this.indicator);

    this.indicator.on("click", (event: paper.MouseEvent) => {
      console.log("here");
      this.select();
    });

    this.repaint();
    synapse.events.on("location", () => {
      this.repaint();
    });

    this.synapse.events.on("updated", this.repaint.bind(this));
  }

  repaint(): void {
    this.line.removeSegments();

    const source = new paper.Point(this.synapse.source.coordinate);
    const target = new paper.Point(this.synapse.target.coordinate);

    const radiusOffset = target.subtract(source);
    radiusOffset.length = 12;
    this.line.add(source.add(radiusOffset), target.subtract(radiusOffset));
    this.indicator.position = target.subtract(radiusOffset);

    const indicatorSize = clamp(Math.abs(this.synapse.weight / 3) + 2, 2.0, 5.0);
    const indicatorColor = new paper.Color(this.synapse.weight > 0 ? "red" : "blue");
    this.indicator.radius = indicatorSize;
    this.indicator.fillColor = indicatorColor;

    this.nodeHandle.strokeColor = new paper.Color("green");
    this.nodeHandle.position = this.indicator.bounds.center;
    this.nodeHandle.size = this.indicator.size.multiply(1.4);
    this.node.addChild(this.nodeHandle);

    const lineColor = new paper.Color(this.synapse.weight > 0 ? "red" : "blue");
    lineColor.brightness = 1;
    lineColor.alpha = this.selected ? 1 : clamp(Math.abs(this.synapse.weight / 8) + 0.1, 0.1, 0.7);
    const strokeWidth = clamp(Math.abs(this.synapse.weight / 4) + 0.5, 0.5, 2.5);
    this.line.strokeColor = lineColor;
    this.line.strokeWidth = strokeWidth;
  }

  select(tag?: any): void {
    if (this.selected) return;
    this.nodeHandle.visible = true;
    this.selected = true;
    this.repaint();
    this.events.fire("selected", tag);
  }

  unselect(): void {
    if (!this.selected) return;
    console.log("unselect");
    this.selected = false;
    this.nodeHandle.visible = false;
    this.repaint();
  }

  delete(): void {
    this.synapse.delete();
  }

  intersects(selection: paper.Shape.Rectangle): boolean {
    return this.line.intersects(selection) || this.indicator.isInside(selection.bounds);
  }

}
