"use client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import OAuthLogin from "../components/OAuthLogin";
import { HeroSection } from "@/components/blocks/hero-section-dark";
export default function Home() {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
      <HeroSection
      title="Welcome to CRM Platform"
      subtitle={{
        regular: "Build stronger relationships.",
        gradient: "Unify your sales, support, and success in one place.",
      }}
      description="Turn your concepts into powerful digital solutions with ease."
      ctaNode={<OAuthLogin/>}
      bottomImage={{
        light: "https://www.launchuicomponents.com/app-light.png",
        dark: "https://www.launchuicomponents.com/app-dark.png",
      }}
      gridOptions={{
        angle: 65,
        opacity: 0.4,
        cellSize: 50,
        lightLineColor: "#4a4a4a",
        darkLineColor: "#2a2a2a",
      }}
    />
 

    </GoogleOAuthProvider>
  );
}
