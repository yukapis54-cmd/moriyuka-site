import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Kpi from "@/components/Kpi";
import PromoBanner from "@/components/PromoBanner";
import About from "@/components/About";
import Products from "@/components/Products";
import FreeGuides from "@/components/FreeGuides";
import Newsletter from "@/components/Newsletter";
import SocialLinks from "@/components/SocialLinks";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Nav />
      <Hero />
      <Kpi />
      <PromoBanner />
      <About />
      <Products />
      <FreeGuides />
      <Newsletter />
      <SocialLinks />
      <Contact />
      <Footer />
    </main>
  );
}
