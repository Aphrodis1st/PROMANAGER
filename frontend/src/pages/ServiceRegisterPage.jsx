import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import { LandingNavigation, LandingFooter } from './ModernLandingPage.jsx';
import {
  getServiceRegistration,
  SERVICE_OPTIONS,
  submitServiceRegistration,
} from '../config/serviceRegistration.js';

const INITIAL_FORM = {
  fullName: '',
  email: '',
  phone: '',
  serviceId: '',
  organizationName: '',
  description: '',
  is_manager: false,
  managerFullName: '',
  managerEmail: '',
  managerPhone: '',
};

const inputClass =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 disabled:bg-gray-50';

function StepIndicator({ currentStep }) {
  const steps = [
    { number: 1, label: 'Your details' },
    { number: 2, label: 'Organization' },
  ];

  return (
    <div className="flex items-center gap-3 mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <StepDot currentStep={currentStep} step={step} />
          {index < steps.length - 1 && (
            <div
              className={`h-0.5 flex-1 rounded ${
                currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function StepDot({ currentStep, step }) {
  const isActive = currentStep === step.number;
  const isComplete = currentStep > step.number;

  return (
    <div className="flex items-center gap-2.5 shrink-0">
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
          isComplete
            ? 'bg-blue-600 text-white'
            : isActive
              ? 'bg-blue-600 text-white ring-4 ring-blue-100'
              : 'bg-gray-100 text-gray-500'
        }`}
      >
        {isComplete ? <CheckCircle className="h-4 w-4" /> : step.number}
      </span>
      <span
        className={`text-sm font-medium hidden sm:block ${
          isActive || isComplete ? 'text-gray-900' : 'text-gray-400'
        }`}
      >
        {step.label}
      </span>
    </div>
  );
}

export default function ServiceRegisterPage() {
  const { serviceId: routeServiceId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const preselectedService = routeServiceId || searchParams.get('service') || '';

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    ...INITIAL_FORM,
    serviceId: preselectedService,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isPendingReview, setIsPendingReview] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [registrationId, setRegistrationId] = useState('');

  const config = getServiceRegistration(formData.serviceId);

  useEffect(() => {
    if (preselectedService) {
      setFormData((prev) => ({ ...prev, serviceId: preselectedService }));
    }
  }, [preselectedService]);

  if (routeServiceId && !getServiceRegistration(routeServiceId)) {
    return <Navigate to="/get-started/register" replace />;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateStep1 = () => {
    if (!formData.fullName.trim()) {
      setError('Please enter your full name.');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Please enter your email address.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Please enter your phone number.');
      return false;
    }
    if (!formData.serviceId) {
      setError('Please select a service.');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.organizationName.trim()) {
      setError('Please enter the organization name.');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Please enter a description.');
      return false;
    }
    if (!formData.is_manager) {
      if (!formData.managerFullName.trim()) {
        setError("Please enter the manager's full name.");
        return false;
      }
      if (!formData.managerEmail.trim()) {
        setError("Please enter the manager's email address.");
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.managerEmail.trim())) {
        setError('Please enter a valid manager email address.');
        return false;
      }
      if (!formData.managerPhone.trim()) {
        setError("Please enter the manager's phone number.");
        return false;
      }
    }
    
    return true;
  };

  const handleNext = (e) => {
    e.preventDefault();
    setError('');
    if (!validateStep1()) return;
    setStep(2);
  };

  const handleBackToServices = () => {
    setError('');
    navigate('/get-started');
  };

  const handleBackToStep1 = () => {
    setError('');
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateStep2()) return;

    setIsLoading(true);
    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        organizationName: formData.organizationName,
        description: formData.description,
        is_manager: formData.is_manager,
      };

      if (!formData.is_manager) {
        payload.managerFullName = formData.managerFullName;
        payload.managerEmail = formData.managerEmail;
        payload.managerPhone = formData.managerPhone;
      }

      const result = await submitServiceRegistration(formData.serviceId, payload);
      setIsPendingReview(Boolean(result?.pending));
      setEmailSent(Boolean(result?.emailSent));
      setRegistrationId(result?.registrationId || '');
      setSubmitted(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Registration failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <LandingNavigation navigate={navigate} />

      <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 bg-blue-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {submitted && config ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 sm:p-10 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <CheckCircle className="h-7 w-7" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                {isPendingReview ? 'Registration submitted' : 'Account created'}
              </h1>
              <p className="text-gray-600 leading-relaxed mb-8 max-w-lg mx-auto">
                {isPendingReview
                  ? `Your ${config.title} registration has been received. Our team will review your details and activate your workspace once payment is confirmed.${
                      emailSent
                        ? formData.is_manager
                          ? ' A confirmation email with payment instructions has been sent to you.'
                          : ' Confirmation emails with payment instructions have been sent to you and the manager.'
                        : ''
                    }`
                  : `Your ${config.title} account is ready.${
                      emailSent
                        ? formData.is_manager
                          ? ' A confirmation email with payment instructions has been sent to you.'
                          : ' Confirmation emails with payment instructions have been sent to you and the manager.'
                        : ''
                    }`}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const params = new URLSearchParams({
                      service: formData.serviceId,
                      org: formData.organizationName,
                    });
                    if (registrationId) params.set('registration', registrationId);
                    navigate(`/process-payment?${params.toString()}`);
                  }}
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Proceed to payment
                </button>
                <button
                  type="button"
                  onClick={() => navigate(config.successRedirect)}
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {isPendingReview ? 'Go to sign in' : 'Continue to dashboard'}
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="border-b border-gray-100 bg-blue-50/60 px-6 sm:px-8 py-6 sm:py-8">
                <div>
                  <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-1">
                    Register
                  </p>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    {config ? config.title : 'Create your account'}
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600">
                    {config
                      ? config.subtitle
                      : 'Tell us about yourself and choose the service you need.'}
                  </p>
                </div>
              </div>

              <div className="px-6 sm:px-8 py-6 sm:py-8">
                <StepIndicator currentStep={step} />

                {error && (
                  <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-5">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {step === 1 ? (
                  <form onSubmit={handleNext} className="space-y-5">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-900 mb-1.5">
                        Full name
                      </label>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required
                        value={formData.fullName}
                        disabled={isLoading}
                        placeholder="John Doe"
                        onChange={handleChange}
                        className={inputClass}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-1.5">
                          Email address
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          disabled={isLoading}
                          placeholder="you@company.com"
                          onChange={handleChange}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-1.5">
                          Phone number
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          disabled={isLoading}
                          placeholder="+250 788 000 000"
                          onChange={handleChange}
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="serviceId" className="block text-sm font-medium text-gray-900 mb-1.5">
                        Select service
                      </label>
                      <select
                        id="serviceId"
                        name="serviceId"
                        required
                        value={formData.serviceId}
                        disabled={isLoading}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="">Choose a service</option>
                        {SERVICE_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row sm:items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={handleBackToServices}
                        disabled={isLoading}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back to service selection
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg transition-colors"
                      >
                        Next
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label htmlFor="organizationName" className="block text-sm font-medium text-gray-900 mb-1.5">
                        Organization name
                      </label>
                      <input
                        id="organizationName"
                        name="organizationName"
                        type="text"
                        required
                        value={formData.organizationName}
                        disabled={isLoading}
                        placeholder="Your organization or business name"
                        onChange={handleChange}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-1.5">
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows={4}
                        required
                        value={formData.description}
                        disabled={isLoading}
                        placeholder="Briefly describe your organization or how you plan to use this service"
                        onChange={handleChange}
                        className={inputClass}
                      />
                    </div>

                    <label className="flex items-start gap-3 cursor-pointer rounded-lg border border-gray-200 bg-white px-4 py-3.5 hover:border-blue-300 transition-colors">
                      <input
                        type="checkbox"
                        name="is_manager"
                        checked={formData.is_manager}
                        disabled={isLoading}
                        onChange={handleChange}
                        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600/20"
                      />
                      <span>
                        <span className="block text-sm font-medium text-gray-900">
                          I am the manager
                        </span>
                        <span className="block text-sm text-gray-600 mt-0.5">
                          Check this if you will manage this account. Uncheck to provide a different manager&apos;s details.
                        </span>
                      </span>
                    </label>

                    {!formData.is_manager && (
                      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 sm:p-5 space-y-4">
                        <p className="text-sm font-medium text-gray-900">Manager details</p>

                        <div>
                          <label htmlFor="managerFullName" className="block text-sm font-medium text-gray-900 mb-1.5">
                            Manager&apos;s full name
                          </label>
                          <input
                            id="managerFullName"
                            name="managerFullName"
                            type="text"
                            required
                            value={formData.managerFullName}
                            disabled={isLoading}
                            placeholder="Jane Smith"
                            onChange={handleChange}
                            className={inputClass}
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="managerEmail" className="block text-sm font-medium text-gray-900 mb-1.5">
                              Manager&apos;s email
                            </label>
                            <input
                              id="managerEmail"
                              name="managerEmail"
                              type="email"
                              required
                              value={formData.managerEmail}
                              disabled={isLoading}
                              placeholder="manager@company.com"
                              onChange={handleChange}
                              className={inputClass}
                            />
                          </div>
                          <div>
                            <label htmlFor="managerPhone" className="block text-sm font-medium text-gray-900 mb-1.5">
                              Manager&apos;s phone
                            </label>
                            <input
                              id="managerPhone"
                              name="managerPhone"
                              type="tel"
                              required
                              value={formData.managerPhone}
                              disabled={isLoading}
                              placeholder="+250 788 000 000"
                              onChange={handleChange}
                              className={inputClass}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col-reverse sm:flex-row sm:items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={handleBackToStep1}
                        disabled={isLoading}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg transition-colors"
                      >
                        {isLoading ? 'Submitting...' : 'Submit'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <LandingFooter navigate={navigate} />
    </div>
  );
}
