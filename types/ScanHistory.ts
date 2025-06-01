import { Allergy } from "@/types/Allergies";

export type ScanHistory = {
  name: string;
  img: string;
  detectedAllergies: Allergy[];
  scanDate: string;
};
