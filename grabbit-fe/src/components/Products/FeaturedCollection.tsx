import { Link } from "react-router-dom";
import featured from "../../assets/featured.webp";

const FeaturedCollection = () => {
  return (
    <section className="py-16 px-4 lg:px-0">
      <div
        className="container mx-auto flex flex-col-reverse lg:flex-row items-center
 bg-white border border-winterella-black"
      >
        {/* Left Content */}
        <div className="lg:w-1/2 p-12 text-center lg:text-left">
          <h2 className="text-lg font-oswald uppercase text-winterella-red mb-2 tracking-widest">
            Comfort and Style
          </h2>
          <h2 className="text-5xl lg:text-7xl font-oswald font-black uppercase mb-6 leading-tight tracking-tighter">
            Apparel made for your <br /> everyday life
          </h2>
          <p className="text-lg text-winterella-black mb-8 max-w-lg">
            Discover high-quality, comfortable clothing that effortlessly blends
            fashion and function. Designed to make you look and feel great every
            day
          </p>
          <Link
            to="/collection/all"
            className="bg-winterella-black text-white px-10 py-4 rounded-none text-xl font-oswald uppercase hover:bg-winterella-red transition-colors duration-300"
          >
            Shop Now
          </Link>
        </div>
        {/* Right Content */}
        <div className="lg:w-1/2">
          <img
            src={featured}
            alt="Featured Collection"
            className="w-full h-[600px] object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollection;
