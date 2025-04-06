import {
  Heart,
  Package,
  Palette,
  RefreshCw,
  Ruler,
  Scissors,
} from 'lucide-react';

import { Link } from 'react-router';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import HeroSecVideo from '../assets/hero-sec-video.mp4';
import Footer from '../components/shared/Footer';
import Navbar from '../components/shared/Navbar';
import TestimonialSlider from '../components/shared/TestimonialSlider';
import { getRequest } from '../utils/apiHandler';
import { useQuery } from '@tanstack/react-query';
import ProductCard from '../components/shop/ProductCard';

function HomePage() {
  const { data: featuredCollection, isLoading } = useQuery({
    queryKey: ['Featured Products'],
    queryFn: async () => {
      try {
        const res = await getRequest({
          endpoint: '/products/featured-collection',
        });

        return res?.data || [];
      } catch (error) {
        return [];
      }
    },
  });

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Hero Section */}

      <header className='relative h-screen overflow-hidden'>
        {/* Video Background */}
        <div className='absolute inset-0 z-0'>
          <video
            className='w-full h-full object-cover'
            autoPlay
            loop
            muted
            playsInline>
            <source src={HeroSecVideo} type='video/mp4' />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Overlay */}
        <div className='absolute inset-0 bg-black/40 z-10' />

        {/* Navbar */}
        <div className='relative z-20'>
          <Navbar bgTransparent />
        </div>

        {/* Hero Content */}
        <div className='relative z-20 flex flex-col items-center justify-center h-full text-center px-4'>
          <h1 className='text-5xl md:text-7xl font-serif text-white mb-6 drop-shadow-lg'>
            Artisanal Elegance
          </h1>
          <p className='text-xl text-white mb-8 max-w-2xl drop-shadow'>
            Discover our collection of premium shawls and bespoke clothing,
            crafted with the finest materials and timeless designs.
          </p>

          <Link to='/shop'>
            <button className='bg-white text-black px-8 py-3 rounded-full hover:bg-gray-100 transition'>
              Explore Collection
            </button>
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <section className='py-20 px-6 lg:px-12 bg-white'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto'>
          <div className='text-center group hover:transform hover:scale-105 transition-all duration-300'>
            <div className='bg-gray-50 p-8 rounded-2xl'>
              <Heart className='w-12 h-12 mx-auto mb-4 text-gray-800' />
              <h3 className='text-xl font-semibold mb-2'>Premium Quality</h3>
              <p className='text-gray-600'>
                Crafted from the finest materials for unparalleled comfort and
                style.
              </p>
            </div>
          </div>
          <div className='text-center group hover:transform hover:scale-105 transition-all duration-300'>
            <div className='bg-gray-50 p-8 rounded-2xl'>
              <RefreshCw className='w-12 h-12 mx-auto mb-4 text-gray-800' />
              <h3 className='text-xl font-semibold mb-2'>Custom Design</h3>
              <p className='text-gray-600'>
                Create your perfect piece with our bespoke customization
                service.
              </p>
            </div>
          </div>
          <div className='text-center group hover:transform hover:scale-105 transition-all duration-300'>
            <div className='bg-gray-50 p-8 rounded-2xl'>
              <Package className='w-12 h-12 mx-auto mb-4 text-gray-800' />
              <h3 className='text-xl font-semibold mb-2'>Global Shipping</h3>
              <p className='text-gray-600'>
                Delivered to your doorstep with care and precision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className='py-20 px-6 lg:px-12 bg-gray-50'>
        <h2 className='text-3xl font-serif text-center mb-12'>
          Featured Collection
        </h2>
        {isLoading ? (
          <div>Fetching Data .... </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto'>
            {featuredCollection?.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Custom Design Process */}
      <section className='py-20 px-6 lg:px-12 bg-white'>
        <div className='max-w-7xl mx-auto'>
          <h2 className='text-3xl font-serif text-center mb-16'>
            Our Custom Design Process
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-12'>
            <div className='relative group'>
              <div className='bg-gray-50 p-8 rounded-2xl shadow-sm text-center transform transition-all duration-300 hover:translate-y-[-10px]'>
                <Palette className='w-12 h-12 mx-auto mb-4 text-gray-800' />
                <h3 className='text-xl font-semibold mb-4'>
                  1. Choose Your Style
                </h3>
                <p className='text-gray-600'>
                  Select from our curated collection of designs or share your
                  vision with our designers.
                </p>
              </div>
            </div>
            <div className='relative group'>
              <div className='bg-gray-50 p-8 rounded-2xl shadow-sm text-center transform transition-all duration-300 hover:translate-y-[-10px]'>
                <Ruler className='w-12 h-12 mx-auto mb-4 text-gray-800' />
                <h3 className='text-xl font-semibold mb-4'>
                  2. Perfect Your Fit
                </h3>
                <p className='text-gray-600'>
                  Get your measurements done by our expert tailors for the
                  perfect fit.
                </p>
              </div>
            </div>
            <div className='relative group'>
              <div className='bg-gray-50 p-8 rounded-2xl shadow-sm text-center transform transition-all duration-300 hover:translate-y-[-10px]'>
                <Scissors className='w-12 h-12 mx-auto mb-4 text-gray-800' />
                <h3 className='text-xl font-semibold mb-4'>
                  3. Crafting Magic
                </h3>
                <p className='text-gray-600'>
                  Watch as our artisans bring your vision to life with
                  meticulous craftsmanship.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialSlider />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default HomePage;

