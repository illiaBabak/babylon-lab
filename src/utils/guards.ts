import { Shape } from "src/types";

export const isShape = (shape: string): shape is Shape =>
  shape === "Box" ||
  shape === "Sphere" ||
  shape === "Cylinder" ||
  shape === "Torus";
