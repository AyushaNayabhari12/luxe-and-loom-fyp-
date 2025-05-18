import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import React from "react";

const Footer = () => {
  return (
    <div>
      {/* Newsletter */}
      <section className="bg-gray-900 text-white py-20 px-6 lg:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-serif mb-6">
            Join Our Exclusive Collection
          </h2>
          <p className="text-gray-400 mb-8">
            Subscribe to receive updates about new collections, special offers,
            and styling tips.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-white"
            />
            <button
              className="px-8 py-3 rounded-full bg-white text-black hover:bg-gray-200 transition"
              type="button"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-16 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h4 className="text-xl font-serif mb-6">Luxe & Loom</h4>
            <p className="text-neutral-400">
              Crafting elegance through premium fabrics and timeless designs
              since 2020.
            </p>
          </div>

          <div>
            <h5 className="font-medium mb-4">Quick Links</h5>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <a href="#" className="hover:text-white">
                  Collections
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Custom Orders
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-medium mb-4">Contact</h5>
            <ul className="space-y-2 text-neutral-400">
              <li className="flex items-center gap-2">
                <Phone size={16} />
                +977 9812345678
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} />
                info@luxeandloom.com
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} />
                Kathmandu Nepal
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-medium mb-4">Follow Us</h5>
            <div className="flex space-x-4">
              <Instagram className="w-6 h-6 hover:text-neutral-400 cursor-pointer" />
              <Facebook className="w-6 h-6 hover:text-neutral-400 cursor-pointer" />
              <Twitter className="w-6 h-6 hover:text-neutral-400 cursor-pointer" />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-neutral-800 text-center text-neutral-400">
          <p>&copy; 2024 Luxe & Loom. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
