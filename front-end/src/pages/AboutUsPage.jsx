import TestimonialSlider from "../components/shared/TestimonialSlider";

function AboutUsPage() {
  return (
    <div className="p-20">
      {/* About Us Content */}
      <section className="py-20 px-6 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-serif mb-8">Our Story</h2>
          <p className="text-lg text-gray-600">
            We are dedicated to creating the finest artisanal products,
            combining traditional craftsmanship with modern design. Our mission
            is to offer bespoke clothing and premium shawls crafted from the
            best materials available. Each piece is designed with passion,
            precision, and care to provide you with something truly special.
          </p>
        </div>
      </section>

      {/* Mission and Values */}
      <section className="py-20 px-6 lg:px-12 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-serif mb-8">Our Mission & Values</h2>
          <p className="text-lg text-gray-600">
            We believe in quality, sustainability, and creativity. Our goal is
            to create timeless pieces that bring joy and confidence to those who
            wear them. We strive to make a positive impact on both our community
            and the environment.
          </p>
        </div>
      </section>

      {/* Custom Design Process */}
      <section className="py-20 px-6 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-serif text-center mb-16">
            Our Custom Design Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="relative group">
              <div className="bg-gray-50 p-8 rounded-2xl shadow-sm text-center transform transition-all duration-300 hover:translate-y-[-10px]">
                <div className="w-12 h-12 mx-auto mb-4 text-gray-800">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 8l4 4-4 4"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4">
                  1. Choose Your Style
                </h3>
                <p className="text-gray-600">
                  Select from our curated collection of designs or share your
                  vision with our designers.
                </p>
              </div>
            </div>
            <div className="relative group">
              <div className="bg-gray-50 p-8 rounded-2xl shadow-sm text-center transform transition-all duration-300 hover:translate-y-[-10px]">
                <div className="w-12 h-12 mx-auto mb-4 text-gray-800">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="6" y1="18" x2="18" y2="6"></line>
                    <path d="M6 6h12v12H6z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4">
                  2. Perfect Your Fit
                </h3>
                <p className="text-gray-600">
                  Get your measurements done by our expert tailors for the
                  perfect fit.
                </p>
              </div>
            </div>
            <div className="relative group">
              <div className="bg-gray-50 p-8 rounded-2xl shadow-sm text-center transform transition-all duration-300 hover:translate-y-[-10px]">
                <div className="w-12 h-12 mx-auto mb-4 text-gray-800">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 12h2v2h-2zM5 12h2v2H5z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4">
                  3. Crafting Magic
                </h3>
                <p className="text-gray-600">
                  Watch as our artisans bring your vision to life with
                  meticulous craftsmanship.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TestimonialSlider />
    </div>
  );
}

export default AboutUsPage;
