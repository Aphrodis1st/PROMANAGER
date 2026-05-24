import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  CheckCircle,
  CreditCard,
  Phone,
  Smartphone,
} from 'lucide-react';
import { LandingNavigation, LandingFooter } from './ModernLandingPage.jsx';
import {
  getServicePricing,
  PAYMENT_CONTACT,
  SUBSCRIPTION_PRICING,
  formatPriceLabel,
} from '../config/paymentConfig.js';

function PricingCard({ service, organizationName }) {
  const Icon = service.icon;

  return (
    <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
      <div className="flex items-start gap-4 mb-6">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/20 text-blue-300 ring-1 ring-blue-400/30">
          <Icon className="h-6 w-6" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-300 mb-1">
            Selected package
          </p>
          <h2 className="text-xl sm:text-2xl font-bold">{service.title}</h2>
          {organizationName && (
            <p className="text-sm text-slate-300 mt-1 flex items-center gap-1.5">
              <Building2 className="h-4 w-4 shrink-0" />
              {organizationName}
            </p>
          )}
          <p className="text-sm text-slate-400 mt-2">{service.tagline}</p>
        </div>
      </div>

      {service.negotiable ? (
        <div className="rounded-xl bg-white/5 ring-1 ring-white/10 px-5 py-4 mb-6">
          <p className="text-sm text-slate-300 mb-1">Pricing</p>
          <p className="text-2xl font-bold text-amber-300">Negotiable prices</p>
          <p className="text-sm text-slate-400 mt-2">
            Contact us to discuss a package tailored to your organization.
          </p>
        </div>
      ) : (
        <>
          <div className="rounded-xl bg-white/5 ring-1 ring-white/10 px-5 py-4 mb-4">
            <p className="text-sm text-slate-300 mb-1">Own this for</p>
            <p className="text-3xl font-bold text-white">
              {formatPriceLabel(service.purchasePrice)}
            </p>
            <p className="text-xs text-slate-400 mt-1">One-time purchase</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: 'Installation', value: SUBSCRIPTION_PRICING.installation },
              { label: 'Monthly', value: SUBSCRIPTION_PRICING.monthly },
              { label: 'Yearly', value: SUBSCRIPTION_PRICING.yearly },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg bg-white/5 ring-1 ring-white/10 px-4 py-3 text-center"
              >
                <p className="text-xs text-slate-400 mb-1">{item.label}</p>
                <p className="text-lg font-semibold">{formatPriceLabel(item.value)}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function PaymentDetailsCard() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
      <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-1">
        Payment details
      </p>
      <h3 className="text-xl font-bold text-gray-900 mb-2">Complete your payment</h3>
      <p className="text-sm text-gray-600 mb-6">
        Use the details below to pay via mobile money or bank transfer. Include your
        organization name as the payment reference.
      </p>

      <div className="space-y-4">
        <div className="flex items-start gap-4 rounded-xl border border-gray-100 bg-blue-50/50 p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
            <Smartphone className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-medium text-gray-900">Mobile money / Phone</p>
            <a
              href={`tel:${PAYMENT_CONTACT.phone.replace(/\s/g, '')}`}
              className="text-lg font-semibold text-blue-600 hover:text-blue-700"
            >
              {PAYMENT_CONTACT.phone}
            </a>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-200 text-gray-700">
            <CreditCard className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900">Bank transfer</p>
            <p className="text-sm text-gray-600 mt-0.5">{PAYMENT_CONTACT.bankName}</p>
            <p className="text-lg font-semibold text-gray-900 mt-1 font-mono tracking-wide">
              {PAYMENT_CONTACT.bankAccount}
            </p>
            <p className="text-sm text-gray-500 mt-0.5">{PAYMENT_CONTACT.accountName}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepsCard() {
  const steps = [
    'Send payment using the phone number or bank account above.',
    'Use your organization name as the payment reference.',
    'Our team will confirm your payment and activate your workspace.',
  ];

  return (
    <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle className="h-5 w-5 text-emerald-600" />
        <h3 className="text-lg font-bold text-gray-900">What happens next</h3>
      </div>
      <ol className="space-y-3">
        {steps.map((step, index) => (
          <li key={step} className="flex items-start gap-3 text-sm text-gray-700">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
              {index + 1}
            </span>
            <span className="pt-0.5">{step}</span>
          </li>
        ))}
      </ol>
      <p className="mt-5 text-sm text-gray-600">
        <Phone className="inline h-4 w-4 shrink-0 text-emerald-600 mr-1.5 -mt-0.5" />
        Questions? Call us at{' '}
        <a
          href={`tel:${PAYMENT_CONTACT.phone.replace(/\s/g, '')}`}
          className="font-semibold text-emerald-700 hover:text-emerald-800"
        >
          {PAYMENT_CONTACT.phone}
        </a>
      </p>
    </div>
  );
}

export default function ProcessPaymentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const serviceId = searchParams.get('service') || '';
  const organizationName = searchParams.get('org') || '';
  const service = getServicePricing(serviceId);

  return (
    <div className="min-h-screen bg-white">
      <LandingNavigation navigate={navigate} />

      <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate('/get-started')}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to services
          </button>

          <div className="mb-8 sm:mb-10">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2">
              Software packages
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Proceed with payment
            </h1>
            <p className="text-gray-600 max-w-2xl">
              Thank you for registering. Review your selected package and use the payment
              details below to complete your subscription or purchase.
            </p>
          </div>

          {!service ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 sm:p-8 text-center">
              <p className="text-gray-800 font-medium mb-2">No service selected</p>
              <p className="text-sm text-gray-600 mb-6">
                Choose a service from our packages page to see pricing details.
              </p>
              <button
                type="button"
                onClick={() => navigate('/get-started')}
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                View software packages
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
              <div className="lg:col-span-3 space-y-6">
                <PricingCard service={service} organizationName={organizationName} />
                <StepsCard />
              </div>
              <div className="lg:col-span-2">
                <PaymentDetailsCard />
              </div>
            </div>
          )}
        </div>
      </main>

      <LandingFooter navigate={navigate} />
    </div>
  );
}
