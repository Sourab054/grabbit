import { FiPhoneCall } from "react-icons/fi";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";
import { TbBrandMeta } from "react-icons/tb";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-gray-300 py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 lg:px-0">
        <div>
          <h3 className="text-xl font-oswald uppercase mb-4 tracking-wider">
            Newsletter
          </h3>
          <p className="text-gray-500 mb-4">
            Be the first to hear about new products, exclusive events, and
            online offers.
          </p>
          <p className="font-medium text-sm text-gray-600 mb-6">
            Sign up and get 10% off your first order.
          </p>

          <form className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="p-3 w-full text-sm border-t border-l border-b border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
              required
            />
            <button
              type="submit"
              className="bg-black text-white px-6 py-3 text-sm rounded-r-md hover:bg-gray-800 transition-all"
            >
              Subscribe
            </button>
          </form>
        </div>

        <div>
          <h3 className="text-xl font-oswald uppercase mb-4 tracking-wider">
            Shop
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link
                to="/collection/all?gender=Men&category=Top+Wear"
                className="hover:text-gray-500 transition-colors"
              >
                Men's Topwear
              </Link>
            </li>
            <li>
              <Link
                to="/collection/all?gender=Women&category=Top+Wear"
                className="hover:text-gray-500 transition-colors"
              >
                Women's Topwear
              </Link>
            </li>
            <li>
              <Link
                to="/collection/all?gender=Men&category=Bottom+Wear"
                className="hover:text-gray-500 transition-colors"
              >
                Men's Bottomwear
              </Link>
            </li>
            <li>
              <Link
                to="/collection/all?gender=Women&category=Bottom+Wear"
                className="hover:text-gray-500 transition-colors"
              >
                Women's Bottomwear
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-oswald uppercase mb-4 tracking-wider">
            Support
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link to="#" className="hover:text-gray-500 transition-colors">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-gray-500 transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-gray-500 transition-colors">
                FAQs
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-gray-500 transition-colors">
                Features
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4">Follow Us</h3>
          <div className="flex items-center space-x-4 mb-6">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className=" hover:text-gray-500"
            >
              <TbBrandMeta className="h-5 w-5" />
            </a>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className=" hover:text-gray-500"
            >
              <IoLogoInstagram className="h-5 w-5" />
            </a>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className=" hover:text-gray-500"
            >
              <RiTwitterXLine className="h-4 w-4" />
            </a>
          </div>
          <p className="text-gray-500">Call Us</p>
          <p>
            <FiPhoneCall className="inline-block mr-2" /> +1 (234) 567-890
          </p>
        </div>
      </div>
      <div className="container mx-auto mt-12 px-4 lg:px-0 border-t border-gray-300 pt-6">
        <p className="text-center tracking-tighter text-sm text-gray-500">
          &copy; 2026 Grabbit. All rights reserved.{" "}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
