// ============================================================================
// AgroKart - Home Page Component
// ============================================================================

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  TruckIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: TruckIcon,
      title: 'Fresh from Farm',
      description: 'Get produce directly from farmers, ensuring maximum freshness and quality.',
    },
    {
      icon: CurrencyDollarIcon,
      title: 'Fair Prices',
      description: 'No middlemen means better prices for farmers and savings for customers.',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Quality Assured',
      description: 'All products are verified and meet our strict quality standards.',
    },
    {
      icon: UserGroupIcon,
      title: 'Support Farmers',
      description: 'Help local farmers grow their business and earn fair wages.',
    },
  ];

  const categories = [
    { name: 'Vegetables', image: '🥕', count: '150+ products' },
    { name: 'Fruits', image: '🍎', count: '120+ products' },
    { name: 'Grains', image: '🌾', count: '80+ products' },
    { name: 'Herbs', image: '🌿', count: '45+ products' },
    { name: 'Dairy', image: '🥛', count: '30+ products' },
    { name: 'Organic', image: '🥬', count: '200+ products' },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Home Chef',
      image: '👩‍🍳',
      quote: 'The produce is incredibly fresh and the prices are unbeatable. I love supporting local farmers!',
    },
    {
      name: 'Raj Patel',
      role: 'Farmer',
      image: '👨‍🌾',
      quote: 'AgroKart helped me reach customers directly and earn fair prices for my organic vegetables.',
    },
    {
      name: 'Maria Rodriguez',
      role: 'Restaurant Owner',
      image: '👩‍💼',
      quote: 'Quality ingredients at great prices. My customers can taste the difference!',
    },
  ];

  const stats = [
    { number: '2,500+', label: 'Happy Customers' },
    { number: '500+', label: 'Verified Farmers' },
    { number: '50+', label: 'Product Categories' },
    { number: '99.5%', label: 'Satisfaction Rate' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10" />
        <div className="relative container-custom py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-display font-bold mb-6">
              Fresh from Farm
              <span className="block text-secondary-300">to Your Table</span>
            </h1>
            <p className="text-xl lg:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Connect directly with local farmers for the freshest produce, fair prices, 
              and sustainable agriculture. Skip the middleman, support your community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="btn-secondary btn-lg text-lg font-semibold"
              >
                Shop Fresh Produce
              </Link>
              <Link
                to="/register"
                className="btn-outline-white btn-lg text-lg font-semibold"
              >
                Start Selling
              </Link>
            </div>
          </div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-neutral-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-neutral-900 mb-4">
              Why Choose AgroKart?
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              We're revolutionizing how you buy fresh produce by connecting you directly with farmers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors duration-300">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-neutral-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-neutral-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-neutral-600">
              Find exactly what you're looking for
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/categories/${category.name.toLowerCase()}`}
                className="group bg-white border border-neutral-200 rounded-2xl p-6 text-center hover:shadow-lg hover:border-primary-200 transition-all duration-300"
              >
                <div className="text-4xl mb-3">
                  {category.image}
                </div>
                <h3 className="font-semibold text-neutral-900 mb-1 group-hover:text-primary-600">
                  {category.name}
                </h3>
                <p className="text-sm text-neutral-500">
                  {category.count}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold font-display mb-2">
                  {stat.number}
                </div>
                <div className="text-primary-200 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-neutral-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-neutral-900 mb-4">
              What People Say
            </h2>
            <p className="text-xl text-neutral-600">
              Hear from our community of farmers and customers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4 text-xl">
                    {testimonial.image}
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-neutral-600">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className="text-neutral-700 italic">
                  "{testimonial.quote}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-secondary-500 to-accent-500 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4">
            Ready to Get Fresh?
          </h2>
          <p className="text-xl text-secondary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of customers who trust AgroKart for their fresh produce needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="btn-white btn-lg text-lg font-semibold"
            >
              Start Shopping
            </Link>
            <Link
              to="/how-it-works"
              className="btn-outline-white btn-lg text-lg font-semibold"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
