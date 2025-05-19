import { useState } from "react";
import OnboardingPage1 from "@/components/onboarding/page1";
import OnboardingPage2 from "@/components/onboarding/page2";

export default function OnboardingScreen() {
  const [page, setPage] = useState(0);

  switch (page) {
    case 0:
      return <OnboardingPage1 onPage={() => setPage(1)} />;
    case 1:
      return <OnboardingPage2 />;
  }
}
