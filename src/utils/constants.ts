import { Environment, Material, Shape } from "src/types";

export const SHAPES: Shape[] = ["Box", "Cylinder", "Sphere", "Torus"] as const;

export const MATERIALS: Material[] = [
  "None",
  "Metal",
  "Glass",
  "Wood",
] as const;

export const ENVIRONMENTS: Environment[] = [
  "None",
  "Room",
  "Road",
  "Night",
  "Studio",
] as const;
