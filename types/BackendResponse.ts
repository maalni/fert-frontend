import { Allergy } from "@/types/Allergies";

export type BackendResponse = {
  name: string;
  detectedAllergies: Allergy[];
};

export const isBackendResponse = (
  object: unknown,
): object is BackendResponse => {
  if (object instanceof Object) {
    if (
      Object.hasOwn(object, "detectedAllergies") &&
      Object.hasOwn(object, "name")
    ) {
      return true;
    }
  }

  return false;
};
