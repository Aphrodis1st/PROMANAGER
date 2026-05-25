import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Package,
  Building2,
  Pill,
  Users,
  HeartHandshake,
  Home,
} from 'lucide-react';
import { LandingNavigation, LandingFooter } from './ModernLandingPage.jsx';

const SERVICES = [
  {
    id: 'stock',
    title: 'Stock Management',
    tagline: 'Inventory, sales, and accounting in one place.',
    icon: Package,
    description:
      'Run inventory, purchases, sales, transfers, and accounting from one place. Track stock across warehouses, automate reorder alerts, and see profit margins in real time — built for retail, wholesale, and multi-branch operations.',
    highlights: [
      'Multi-warehouse inventory with real-time sync',
      'Purchases, sales, dispense, and returns',
      'Tax rules, journals, and financial reports',
    ],
    registerPath: '/get-started/register?service=stock',
  },
  {
    id: 'hospital',
    title: 'Hospital Management',
    tagline: 'Clinical and admin workflows on one platform.',
    icon: Building2,
    description:
      'Digitize clinical and administrative workflows: patients, appointments, labs, wards, billing, and medical records on a single healthcare platform designed for hospitals and clinics of every size.',
    highlights: [
      'Electronic medical records and patient history',
      'Appointments, lab orders, and ward management',
      'Billing, insurance claims, and revenue reports',
    ],
    registerPath: '/get-started/register?service=hospital',
  },
  {
    id: 'pharmacy',
    title: 'Pharmacy Services',
    tagline: 'Prescriptions, inventory, and compliance.',
    icon: Pill,
    description:
      'Manage prescriptions, drug inventory, expiry control, and pharmacy sales with compliance-friendly tools built for dispensaries and retail pharmacies that need accuracy and speed at the counter.',
    highlights: [
      'Prescription verification and dispensing',
      'Drug interaction and expiry alerts',
      'Inventory, sales, and analytics dashboards',
    ],
    registerPath: '/get-started/register?service=pharmacy',
  },
  {
    id: 'hr',
    title: 'HR & Payroll',
    tagline: 'People, attendance, and pay in sync.',
    icon: Users,
    description:
      'Handle employees, attendance, leave, payroll, and performance reviews. Automate pay runs with tax rules, keep HR data centralized, and give managers the visibility they need without spreadsheets.',
    highlights: [
      'Employee profiles and attendance tracking',
      'Payroll with configurable tax rules',
      'Leave management and performance reviews',
    ],
    registerPath: '/get-started/register?service=hr',
  },
  {
    id: 'ngo',
    title: 'NGO Management',
    tagline: 'Projects, donors, finance, and field impact.',
    icon: HeartHandshake,
    description:
      'Coordinate organizations, branches, projects, donors, beneficiaries, finance, contracts, and field impact — built for NGOs, churches, and humanitarian teams that need transparency and accountability.',
    highlights: [
      'Projects, grants, and donor relationship management',
      'Finance, contracts, and compliance tracking',
      'Monitoring, evaluation, GIS, and impact reporting',
    ],
    registerPath: '/get-started/register?service=ngo',
  },
  {
    id: 'property',
    title: 'Property Management',
    tagline: 'Leases, rent, tenants, and maintenance.',
    icon: Home,
    description:
      'Manage properties, units, tenants, leases, rent billing, maintenance, and owner or tenant portals from one property operations hub — ideal for landlords, agencies, and estate managers.',
    highlights: [
      'Properties, units, and lease lifecycle',
      'Automated rent billing and reminders',
      'Maintenance requests and tenant portals',
    ],
    registerPath: '/get-started/register?service=property',
  },
];

export default function GetStartedPage() {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState(SERVICES[0].id);
  const activeService = SERVICES.find((s) => s.id === activeId) ?? SERVICES[0];
  const ActiveIcon = activeService.icon;

  return (
    <div className="min-h-screen bg-white">
      <LandingNavigation navigate={navigate} />

      <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <section className="text-center mb-10 sm:mb-12">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </button>
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-3">
              Get started
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Choose your service
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              PROMANAGER is an all-in-one digital management platform. Select a module
              below to learn what it offers, then register to set up your workspace.
            </p>
          </section>

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <nav className="lg:w-72 xl:w-80 shrink-0" aria-label="Services">
              <ul className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 -mx-1 px-1 lg:mx-0 lg:px-0">
                {SERVICES.map((service) => {
                  const Icon = service.icon;
                  const isActive = service.id === activeId;

                  return (
                    <li key={service.id} className="shrink-0 lg:shrink">
                      <button
                        type="button"
                        onClick={() => setActiveId(service.id)}
                        aria-current={isActive ? 'true' : undefined}
                        className={`w-full min-w-[220px] lg:min-w-0 text-left rounded-xl border px-4 py-3.5 transition-all duration-200 ${
                          isActive
                            ? 'border-blue-600 bg-white shadow-md ring-1 ring-blue-600'
                            : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                              isActive
                                ? 'bg-blue-600 text-white'
                                : 'bg-blue-50 text-blue-600'
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="min-w-0">
                            <span
                              className={`block text-sm font-semibold ${
                                isActive ? 'text-blue-600' : 'text-gray-900'
                              }`}
                            >
                              {service.title}
                            </span>
                            <span className="mt-0.5 block text-xs text-gray-500 leading-snug line-clamp-2">
                              {service.tagline}
                            </span>
                          </span>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <article className="flex-1 min-w-0 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="border-b border-gray-100 bg-blue-50/60 px-6 sm:px-8 py-6 sm:py-8">
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                    <ActiveIcon className="h-6 w-6" />
                  </span>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                      {activeService.title}
                    </h2>
                    <p className="text-sm sm:text-base text-blue-600 font-medium">
                      {activeService.tagline}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-6 sm:px-8 py-6 sm:py-8">
                <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-6">
                  {activeService.description}
                </p>

                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                  Key capabilities
                </h3>
                <ul className="space-y-2.5 mb-8">
                  {activeService.highlights.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm sm:text-base text-gray-600"
                    >
                      <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => navigate(activeService.registerPath)}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm sm:text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
                >
                  Register for {activeService.title}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </article>
          </div>

          <p className="mt-10 text-center text-sm text-gray-500 max-w-2xl mx-auto">
            Hospital, pharmacy, HR, NGO, and property accounts are often provisioned by your
            administrator. Use Register to sign in or complete setup for your organization.
          </p>
        </div>
      </main>

      <LandingFooter navigate={navigate} />
    </div>
  );
}
