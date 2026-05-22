import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Package, 
  Stethoscope, 
  Users, 
  Pill,
  Home,
  HeartHandshake,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Shield,
  Zap,
  Store,
  Hospital,
  ShoppingBag,
  Building,
  Database,
  Layers,
  Monitor
} from 'lucide-react';

// Navigation Component
const Navigation = ({ navigate }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-1.5 sm:p-2 rounded-lg">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-gray-900">PROMANAGER</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Home</a>
            <a href="#services" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Services</a>
            <a href="#about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">About</a>
            <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Contact</a>
          </div>

          <button
            onClick={() => navigate('/stock/register')}
            className="hidden sm:block px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm sm:text-base font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
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
    <section className="pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
            The Complete Digital
            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Management Platform
            </span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-6 sm:mb-8 md:mb-10 px-4">
            Streamline operations across retail, healthcare, pharmacy, NGO, church, HR, and property management 
            with our unified, intelligent platform designed for modern businesses.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <button
              onClick={() => navigate('/stock/register')}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm sm:text-base font-semibold rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center"
            >
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
            <button
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-900 text-sm sm:text-base font-semibold rounded-lg border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600 transition-all duration-300"
            >
              Explore Solutions
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
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1 sm:mb-2">
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
      icon: <Store className="w-8 h-8" />,
      title: 'Retail & Inventory Businesses',
      description: 'Manage product inventory, track sales performance, optimize supply chains, and automate procurement processes.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <Hospital className="w-8 h-8" />,
      title: 'Healthcare Facilities',
      description: 'Digitize hospital workflows including patient records, appointment scheduling, laboratory management, and billing.',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: <Pill className="w-8 h-8" />,
      title: 'Pharmaceutical Businesses',
      description: 'Ensure regulatory compliance while managing prescriptions, drug inventories, and customer service operations efficiently.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: <HeartHandshake className="w-8 h-8" />,
      title: 'NGOs, Churches & Humanitarian Organizations',
      description: 'Manage donors, beneficiaries, volunteers, projects, grants, church activities, field teams, and impact reporting.',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      icon: <Building className="w-8 h-8" />,
      title: 'Multi-Branch Organizations',
      description: 'Monitor and manage operations across multiple locations with real-time data synchronization and centralized reporting.',
      color: 'from-orange-500 to-orange-600'
    }
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
                <div className={`bg-gradient-to-r ${industry.color} p-2 sm:p-3 rounded-lg text-white flex-shrink-0`}>
                  {industry.icon}
                </div>
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
      icon: <Package className="w-10 h-10" />,
      title: 'Stock Management System',
      description: 'Complete inventory intelligence platform for stock control and supply chain optimization.',
      features: ['Real-time inventory sync', 'Automated stock alerts', 'Supplier performance analytics', 'Multi-warehouse control'],
      color: 'from-blue-500 to-blue-600',
      path: '/stock/login'
    },
    {
      icon: <Stethoscope className="w-10 h-10" />,
      title: 'Hospital Management System',
      description: 'Comprehensive digital healthcare platform for clinical and administrative operations.',
      features: ['Electronic Medical Records', 'Patient tracking', 'Appointment scheduling', 'Lab integration'],
      color: 'from-green-500 to-green-600',
      path: '/hospital/login'
    },
    {
      icon: <Pill className="w-10 h-10" />,
      title: 'Pharmacy Services System',
      description: 'Pharmacy management with prescription processing and compliance reporting.',
      features: ['Prescription verification', 'Drug interaction alerts', 'Expiry monitoring', 'Insurance billing'],
      color: 'from-purple-500 to-purple-600',
      path: '/pharmacy/login'
    },
    {
      icon: <Users className="w-10 h-10" />,
      title: 'HR & Payroll Management',
      description: 'Enterprise HR platform for employee management and payroll processing.',
      features: ['Attendance tracking', 'Payroll calculation', 'Leave management', 'Performance reviews'],
      color: 'from-indigo-500 to-indigo-600',
      path: '/hr/login'
    },
    {
      icon: <HeartHandshake className="w-10 h-10" />,
      title: 'NGO Management System',
      description: 'Complete platform for NGOs, churches, humanitarian relief, donors, programs, grants, and field impact.',
      features: ['Donor and beneficiary CRM', 'Projects and grants', 'Church and volunteer management', 'M&E and GIS analytics'],
      color: 'from-emerald-500 to-teal-600',
      path: '/ngo'
    },
    {
      icon: <Home className="w-10 h-10" />,
      title: 'Property Management System',
      description: 'Complete solution for managing properties, tenants, and maintenance operations.',
      features: ['Tenant management', 'Automated billing', 'Maintenance tracking', 'Owner portals'],
      color: 'from-orange-500 to-orange-600',
      path: '/property'
    }
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {modules.map((module, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-4 sm:p-6 border-2 border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all duration-300 group"
            >
              <div className={`bg-gradient-to-r ${module.color} p-2 sm:p-3 rounded-lg text-white inline-block mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {module.icon}
              </div>
              
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">{module.title}</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">{module.description}</p>
              
              <ul className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
                {module.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-xs sm:text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => navigate(module.path)}
                className="w-full py-1.5 sm:py-2 text-sm sm:text-base bg-gray-100 text-gray-900 font-semibold rounded-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white transition-all duration-300"
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Super Admin Callout Component
const SuperAdminCallout = ({ navigate }) => {
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-r from-gray-900 to-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-block p-2 sm:p-3 bg-red-500/20 rounded-full mb-4 sm:mb-6">
          <Shield className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-red-400" />
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
          Super Admin Access
        </h2>
        <p className="text-sm sm:text-base text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
          System administrators can access the Super Admin panel to manage hospitals, NGOs, 
          monitor system-wide activities, and configure platform settings.
        </p>
        
        <button
          onClick={() => navigate('/super-admin/login')}
          className="px-6 sm:px-8 py-2.5 sm:py-3 bg-red-600 text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-red-700 hover:shadow-xl transition-all duration-300"
        >
          🔐 Access Admin Panel
        </button>
      </div>
    </section>
  );
};

// Platform Architecture Component
const PlatformArchitecture = () => {
  const layers = [
    {
      icon: <Monitor className="w-8 h-8" />,
      title: 'User Interface Layer',
      description: 'Web Application / Mobile Access',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <Layers className="w-8 h-8" />,
      title: 'Application Services',
      description: 'Inventory Engine • Healthcare Engine • Pharmacy Engine • NGO Impact Engine',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: 'Data Layer',
      description: 'Secure Cloud Database • Encrypted Storage • Backup & Recovery',
      color: 'from-purple-500 to-purple-600'
    }
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
              <div className={`bg-gradient-to-r ${layer.color} p-3 sm:p-4 rounded-full text-white inline-block mb-3 sm:mb-4`}>
                {layer.icon}
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
const Footer = ({ navigate }) => {
  return (
    <footer id="contact" className="bg-gray-900 text-white py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Building2 className="w-6 h-6" />
              <span className="text-xl font-bold">PROMANAGER</span>
            </div>
            <p className="text-gray-400 text-sm">
              Your all-in-one business management solution for modern enterprises.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Solutions</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="hover:text-white cursor-pointer" onClick={() => navigate('/stock/login')}>Stock Management</li>
              <li className="hover:text-white cursor-pointer" onClick={() => navigate('/hospital/login')}>Hospital Management</li>
              <li className="hover:text-white cursor-pointer" onClick={() => navigate('/pharmacy/login')}>Pharmacy Services</li>
              <li className="hover:text-white cursor-pointer" onClick={() => navigate('/ngo')}>NGO Management</li>
              <li className="hover:text-white cursor-pointer" onClick={() => navigate('/hr/login')}>HR Management</li>
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
      <Navigation navigate={navigate} />
      <HeroSection navigate={navigate} />
      <StatsBar />
      <IndustrySolutions />
      <CoreModules navigate={navigate} />
      <SuperAdminCallout navigate={navigate} />
      <PlatformArchitecture />
      <Footer navigate={navigate} />
    </div>
  );
}
