import { Link } from "react-router-dom";
import heroImg from "../../assets/rabbit-hero.webp";

const Hero = () => {
  return (
    <section className="relative h-[80vh] overflow-hidden">
      <img src={heroImg} alt="Rabbit" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-winterella-black/20 flex flex-col items-center justify-center">
        <div className="text-center text-winterella-off-white p-6">
          <h1 className="text-6xl md:text-[12rem] font-oswald font-black leading-none tracking-normal uppercase mb-4 drop-shadow-sm">
            VACATION <br />{" "}
            <span className="text-winterella-off-white">READY</span>
          </h1>
          <p className="text-sm md:text-xl font-medium tracking-widest uppercase mb-8">
            Get ready for your next adventure
          </p>
          <Link
            to="/collection/all"
            className="bg-winterella-red text-white px-12 py-4 rounded-none text-xl font-oswald uppercase hover:bg-winterella-black transition-colors duration-300"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
