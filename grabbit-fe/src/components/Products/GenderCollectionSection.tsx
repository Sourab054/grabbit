import { Link } from "react-router-dom";
import womensCollectionImage from "../../assets/womens-collection.webp";
import mensCollectionImage from "../../assets/mens-collection.webp";

const GenderCollectionSection = () => {
  return (
    <section className="py-16 px-4 lg:px-0">
      <div className="container mx-auto flex flex-col md:flex-row gap-8">
        {/* Women's Collection */}
        <div className="relative flex-1">
          <img
            src={womensCollectionImage}
            alt="Women's Collection"
            className="w-full h-175 object-cover"
          />
          <div className="absolute bottom-8 left-8 bg-winterella-off-white p-6 border border-winterella-black">
            <h2 className="text-3xl font-oswald uppercase text-winterella-black mb-2">
              Women's Collection
            </h2>
            <Link
              to="/collection/all?gender=Women"
              className="text-gray-900 underline"
            >
              Shop Now
            </Link>
          </div>
        </div>
        {/* Men's Collection */}
        <div className="relative flex-1">
          <img
            src={mensCollectionImage}
            alt="Men's Collection"
            className="w-full h-175 object-cover"
          />
          <div className="absolute bottom-8 left-8 bg-winterella-off-white p-6 border border-winterella-black">
            <h2 className="text-3xl font-oswald uppercase text-winterella-black mb-2">
              Men's Collection
            </h2>
            <Link
              to="/collection/all?gender=Men"
              className="text-gray-900 underline"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GenderCollectionSection;
