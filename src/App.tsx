import Header from "./components/Header";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Works from "./components/Works";
import About from "./components/About";
import Brands from "./components/Brands";
import Notice from "./components/Notice";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import WhatsAppFloat from "./components/WhatsAppFloat";

export default function App() {
  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo">
        <Hero />
        <Services />
        <Works />
        <Notice />
        <About />
        <Brands />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
