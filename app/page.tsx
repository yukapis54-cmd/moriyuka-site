import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Kpi from "@/components/Kpi";
import About from "@/components/About";
import Products from "@/components/Products";
import Newsletter from "@/components/Newsletter";
import SocialLinks from "@/components/SocialLinks";
import Business from "@/components/Business";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Nav />
      <Hero />
      <Kpi />
      <About />
      <Products />
      <Newsletter />
      <SocialLinks />
      <Business />
      <Contact />
      <Footer />
    </main>
  );
}
