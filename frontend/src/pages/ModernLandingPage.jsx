import React from 'react';
import { useNavigate } from 'react-router-dom';
import proLogo from '../../pro_logo.png';
import { ArrowRight, CheckCircle } from 'lucide-react';

// Verified Unsplash URLs (auto=format for broader browser support)
const img = (id, w = 200, h = 200) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&auto=format`;

const UNSPLASH = {
  retail: img('photo-1586528116311-ad8dd3c8310d'),
  healthcare: img('photo-1519494026892-80bbd2d6fd0d'),
  pharmacy: img('photo-1576091160399-112ba8d25d1d'),
  ngo: img('photo-1529156069898-49953e39b3ac'),
  multiBranch: img('photo-1497366216548-37526070297c'),
  stock: img('photo-1553413077-190dd305871c', 240, 240),
  hospital: img('photo-1612349317150-e413f6a5b16d', 240, 240),
  pharmacyModule: img('photo-1471864190281-a93a3070b6de', 240, 240),
  hr: img('photo-1600880292203-757bb62b4baf', 240, 240),
  ngoModule: img('photo-1529390079861-591de354faf5', 240, 240),
  property: img('photo-1560518883-ce09059eeffa', 240, 240),
  uiLayer: img('photo-1498050108023-c5249f4df085'),
  appServices: img('photo-1451187580459-43490279c0fa'),
  dataLayer: img('photo-1558494949-ef010cbdcc31'),
};

const FALLBACK_THUMB = UNSPLASH.retail;
const BANNER = (id) => img(id, 640, 360);

function useImageWithFallback(src) {
  const [imgSrc, setImgSrc] = React.useState(src);
  React.useEffect(() => {
    setImgSrc(src);
  }, [src]);
  const onError = () => {
    if (imgSrc !== FALLBACK_THUMB) setImgSrc(FALLBACK_THUMB);
  };
  return { imgSrc, onError };
}

function CardBannerImage({ src, alt }) {
  const { imgSrc, onError } = useImageWithFallback(src);
  return (
    <img
      src={imgSrc}
      alt={alt}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={onError}
      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
    />
  );
}

function CardThumbnail({ src, alt, size = 'md', rounded = 'lg' }) {
  const { imgSrc, onError } = useImageWithFallback(src);
  const sizes = {
    sm: 'w-12 h-12',
    md: 'w-14 h-14 sm:w-16 sm:h-16',
    lg: 'w-20 h-20 sm:w-24 sm:h-24',
  };
  const roundedClass = rounded === 'full' ? 'rounded-full' : 'rounded-lg';

  return (
    <img
      src={imgSrc}
      alt={alt}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={onError}
      className={`${sizes[size]} ${roundedClass} object-cover shrink-0 ring-1 ring-gray-200 bg-gray-100`}
    />
  );
}

// Navigation Component
export const LandingNavigation = ({ navigate }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
            <img
              src={proLogo}
              alt="PROMANAGER"
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain rounded-lg"
            />
            <span className="text-lg sm:text-xl font-bold text-gray-900">PROMANAGER</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Home</a>
            <a href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Services</a>
            <a href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">About</a>
            <a href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Contact</a>
          </div>

          <button
            onClick={() => navigate('/login')}
            className="hidden sm:block px-4 sm:px-5 py-2 sm:py-2.5 text-blue-600 hover:text-blue-700 text-sm sm:text-base font-semibold rounded-lg border border-blue-200 hover:border-blue-400 transition-all duration-300 mr-2"
          >
            Sign in
          </button>
          <button
            onClick={() => navigate('/get-started')}
            className="hidden sm:block px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};

// Hero Section Component
const HeroSection = ({ navigate }) => {
  return (
    <section className="pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-20 bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
            The Complete Digital
            <span className="block text-blue-600">
              Management Platform
            </span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-6 sm:mb-8 md:mb-10 px-4">
            Streamline operations across retail, healthcare, pharmacy, NGO, church, HR, and property management 
            with our unified, intelligent platform designed for modern businesses.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <button
              onClick={() => navigate('/get-started')}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-semibold rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-900 text-sm sm:text-base font-semibold rounded-lg border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600 transition-all duration-300"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Stats Bar Component
const StatsBar = () => {
  const stats = [
    { number: '10,000+', label: 'Businesses Supported' },
    { number: '1M+', label: 'Transactions Processed' },
    { number: '500K+', label: 'Inventory Items Managed' },
    { number: '50K+', label: 'Patient Records Processed' }
  ];

  return (
    <section className="py-12 sm:py-16 bg-white border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600 mb-1 sm:mb-2">
                {stat.number}
              </div>
              <div className="text-sm sm:text-base text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Industry Solutions Component
const IndustrySolutions = () => {
  const industries = [
    {
      image: UNSPLASH.retail,
      imageAlt: 'Retail warehouse inventory',
      title: 'Retail & Inventory Businesses',
      description: 'Manage product inventory, track sales performance, optimize supply chains, and automate procurement processes.',
    },
    {
      image: UNSPLASH.healthcare,
      imageAlt: 'Healthcare facility',
      title: 'Healthcare Facilities',
      description: 'Digitize hospital workflows including patient records, appointment scheduling, laboratory management, and billing.',
    },
    {
      image: UNSPLASH.pharmacy,
      imageAlt: 'Pharmacy and medicine',
      title: 'Pharmaceutical Businesses',
      description: 'Ensure regulatory compliance while managing prescriptions, drug inventories, and customer service operations efficiently.',
    },
    {
      image: UNSPLASH.ngo,
      imageAlt: 'Community and humanitarian work',
      title: 'NGOs, Churches & Humanitarian Organizations',
      description: 'Manage donors, beneficiaries, volunteers, projects, grants, church activities, field teams, and impact reporting.',
    },
    {
      image: UNSPLASH.multiBranch,
      imageAlt: 'Corporate office buildings',
      title: 'Multi-Branch Organizations',
      description: 'Monitor and manage operations across multiple locations with real-time data synchronization and centralized reporting.',
    },
  ];

  return (
    <section id="services" className="py-12 sm:py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Industries We Serve
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Tailored solutions for diverse business sectors with specialized features and workflows
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          {industries.map((industry, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start space-x-3 sm:space-x-4">
                <CardThumbnail src={industry.image} alt={industry.imageAlt} />
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">{industry.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{industry.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Core Modules Component
const CoreModules = ({ navigate }) => {
  const modules = [
    {
      image: BANNER('photo-1553413077-190dd305871c'),
      imageAlt: 'Warehouse and stock management',
      title: 'Stock Management System',
      description: 'Complete inventory intelligence platform for stock control and supply chain optimization.',
      features: ['Real-time inventory sync', 'Automated stock alerts', 'Supplier performance analytics', 'Multi-warehouse control'],
       path: '/login',
    },
    {
      image: BANNER('photo-1612349317150-e413f6a5b16d'),
      imageAlt: 'Medical team in a hospital',
      title: 'Hospital Management System',
      description: 'Comprehensive digital healthcare platform for clinical and administrative operations.',
      features: ['Electronic Medical Records', 'Patient tracking', 'Appointment scheduling', 'Lab integration'],
      path: '/login',
    },
    {
      image: BANNER('photo-1471864190281-a93a3070b6de'),
      imageAlt: 'Pharmacy services',
      title: 'Pharmacy Services System',
      description: 'Pharmacy management with prescription processing and compliance reporting.',
      features: ['Prescription verification', 'Drug interaction alerts', 'Expiry monitoring', 'Insurance billing'],
      path: '/login',
    },
    {
      image: BANNER('photo-1600880292203-757bb62b4baf'),
      imageAlt: 'HR team collaboration',
      title: 'HR & Payroll Management',
      description: 'Enterprise HR platform for employee management and payroll processing.',
      features: ['Attendance tracking', 'Payroll calculation', 'Leave management', 'Performance reviews'],
      path: '/login',
    },
    {
      image: BANNER('photo-1529390079861-591de354faf5'),
      imageAlt: 'Humanitarian aid and community outreach',
      title: 'NGO Management System',
      description: 'Complete platform for NGOs, churches, humanitarian relief, donors, programs, grants, and field impact.',
      features: ['Donor and beneficiary CRM', 'Projects and grants', 'Church and volunteer management', 'M&E and GIS analytics'],
      path: '/ngo',
    },
    {
      image: BANNER('photo-1560518883-ce09059eeffa'),
      imageAlt: 'Property and real estate',
      title: 'Property Management System',
      description: 'Complete solution for managing properties, tenants, and maintenance operations.',
      features: ['Tenant management', 'Automated billing', 'Maintenance tracking', 'Owner portals'],
      path: '/property',
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Core Management Modules
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Powerful, integrated systems designed to streamline every aspect of your business
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {modules.map((module, index) => (
            <article
              key={index}
              className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:border-blue-500 hover:shadow-xl transition-all duration-300"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                <CardBannerImage src={module.image} alt={module.imageAlt} />
              </div>

              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 leading-snug">
                  {module.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{module.description}</p>

                <ul className="flex-1 grid grid-cols-1 gap-2 mb-5">
                  {module.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 bg-gray-50 rounded-md px-2.5 py-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-green-600 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => navigate('/get-started')}
                  className="w-full py-2.5 text-sm sm:text-base bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  Learn more
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

// Super Admin Callout Component
// const SuperAdminCallout = ({ navigate }) => {
//   return (
//     <section className="py-12 sm:py-16 bg-gradient-to-r from-gray-900 to-gray-800">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//         <div className="inline-block p-2 sm:p-3 bg-red-500/20 rounded-full mb-4 sm:mb-6">
//           <Shield className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-red-400" />
//         </div>
        
//         <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
//           Super Admin Access
//         </h2>
//         <p className="text-sm sm:text-base text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
//           System administrators can access the Super Admin panel to manage hospitals, NGOs, 
//           monitor system-wide activities, and configure platform settings.
//         </p>
        
//         <button
//           onClick={() => navigate('/super-admin/login')}
//           className="px-6 sm:px-8 py-2.5 sm:py-3 bg-red-600 text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-red-700 hover:shadow-xl transition-all duration-300"
//         >
//           🔐 Access Admin Panel
//         </button>
//       </div>
//     </section>
//   );
// };

// Platform Architecture Component
const PlatformArchitecture = () => {
  const layers = [
    {
      image: UNSPLASH.uiLayer,
      imageAlt: 'Web and mobile user interface',
      title: 'User Interface Layer',
      description: 'Web Application / Mobile Access',
    },
    {
      image: UNSPLASH.appServices,
      imageAlt: 'Cloud application services',
      title: 'Application Services',
      description: 'Inventory Engine • Healthcare Engine • Pharmacy Engine • NGO Impact Engine',
    },
    {
      image: UNSPLASH.dataLayer,
      imageAlt: 'Secure data infrastructure',
      title: 'Data Layer',
      description: 'Secure Cloud Database • Encrypted Storage • Backup & Recovery',
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Platform Architecture
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Built on a robust, scalable three-tier architecture for maximum performance and security
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
          {layers.map((layer, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 sm:p-8 text-center border-2 border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all duration-300"
            >
              <div className="inline-block mb-3 sm:mb-4">
                <CardThumbnail src={layer.image} alt={layer.imageAlt} size="lg" rounded="full" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">{layer.title}</h3>
              <p className="text-sm sm:text-base text-gray-600">{layer.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Footer Component
export const LandingFooter = ({ navigate }) => {
  return (
    <footer id="contact" className="bg-gray-900 text-white py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img src={proLogo} alt="PROMANAGER" className="w-8 h-8 object-contain rounded-lg" />
              <span className="text-xl font-bold">PROMANAGER</span>
            </div>
            <p className="text-gray-400 text-sm">
              Your all-in-one business management solution for modern enterprises.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Solutions</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="hover:text-white cursor-pointer" onClick={() => navigate('/login')}>Stock Management</li>
              <li className="hover:text-white cursor-pointer" onClick={() => navigate('/login')}>Hospital Management</li>
              <li className="hover:text-white cursor-pointer" onClick={() => navigate('/login')}>Pharmacy Services</li>
              <li className="hover:text-white cursor-pointer" onClick={() => navigate('/ngo')}>NGO Management</li>
              <li className="hover:text-white cursor-pointer" onClick={() => navigate('/login')}>HR Management</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="hover:text-white cursor-pointer">Documentation</li>
              <li className="hover:text-white cursor-pointer">Support Center</li>
              <li className="hover:text-white cursor-pointer">API Integration</li>
              <li className="hover:text-white cursor-pointer">Training Videos</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="hover:text-white cursor-pointer">About Us</li>
              <li className="hover:text-white cursor-pointer">Careers</li>
              <li className="hover:text-white cursor-pointer">Contact</li>
              <li className="hover:text-white cursor-pointer">Privacy Policy</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2024 PROMANAGER. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

// Main Landing Page Component
export default function ModernLandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <LandingNavigation navigate={navigate} />
      <HeroSection navigate={navigate} />
      <StatsBar />
      <IndustrySolutions />
      <CoreModules navigate={navigate} />
      {/* <SuperAdminCallout navigate={navigate} /> */}
      <PlatformArchitecture />
      <LandingFooter navigate={navigate} />
    </div>
  );
}
