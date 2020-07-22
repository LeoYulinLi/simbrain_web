import paper from "paper";

export default abstract class ScreenElement {
  abstract select(tag?: any): void
  abstract unselect(): void
  abstract delete(): void
  abstract intersects(selection: paper.Shape.Rectangle): boolean;
}
