export const Allergies = [
  "milk",
  "eggs",
  "fish",
  "shellfish",
  "treeNuts",
  "peanuts",
  "wheat",
  "soybeans",
  "sesame",
] as const;

export type Allergy = (typeof Allergies)[number];

export const isAllergyList = (object: any): object is Allergy[] => {
  return true;
};
