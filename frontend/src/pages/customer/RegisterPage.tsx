// ============================================================================
// AgroKart - Register Page Component
// ============================================================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAuthActions } from '../../store/authStore';
import { RegisterForm, UserRole } from '../../types';
import { InlineSpinner } from '../../components/common/LoadingSpinner';

// Validation schema with explicit typing
const registerSchema: yup.ObjectSchema<RegisterForm> = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  firstName: yup
    .string()
    .min(2, 'First name must be at least 2 characters')
    .required('First name is required'),
  lastName: yup
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .required('Last name is required'),
  phone: yup.string().optional(),
  role: yup
    .string()
    .oneOf(['customer', 'farmer', 'middleman'], 'Please select a valid role')
    .required('Please select your role') as yup.StringSchema<UserRole>,
  // Conditional fields based on role
  farmName: yup.string().when('role', {
    is: 'farmer',
    then: (schema) => schema.required('Farm name is required for farmers'),
    otherwise: (schema) => schema.optional(),
  }),
  farmAddress: yup.string().when('role', {
    is: 'farmer',
    then: (schema) => schema.required('Farm address is required for farmers'),
    otherwise: (schema) => schema.optional(),
  }),
  companyName: yup.string().when('role', {
    is: 'middleman',
    then: (schema) => schema.required('Company name is required for middlemen'),
    otherwise: (schema) => schema.optional(),
  }),
});

const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  
  const { register: registerUser } = useAuthActions();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      role: 'customer',
    },
  });

  const watchedRole = watch('role');

  const onSubmit = async (data: RegisterForm) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const success = await registerUser(data);
      
      if (success) {
        navigate('/dashboard', { replace: true });
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = [
    {
      value: 'customer' as UserRole,
      label: 'Customer',
      description: 'I want to buy fresh produce',
      icon: '🛒',
    },
    {
      value: 'farmer' as UserRole,
      label: 'Farmer',
      description: 'I want to sell my produce directly',
      icon: '🌾',
    },
    {
      value: 'middleman' as UserRole,
      label: 'Middleman',
      description: 'I want to help farmers distribute their produce',
      icon: '🚛',
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center mb-8">
          <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center mr-3">
            <span className="text-white font-bold text-lg">AG</span>
          </div>
          <span className="text-2xl font-display font-bold text-neutral-900">
            AgroKart
          </span>
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-display font-bold text-neutral-900">
            Join AgroKart
          </h2>
          <p className="mt-2 text-neutral-600">
            Connect with farmers and fresh produce
          </p>
          <p className="mt-1 text-sm text-neutral-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Sign in here
            </Link>
          </p>
        </div>

        <div className="bg-white shadow-sm border border-neutral-200 rounded-lg p-6 sm:p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                I am a...
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {roleOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`
                      relative flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
                      ${watchedRole === option.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-neutral-200 hover:border-primary-200'
                      }
                    `}
                  >
                    <input
                      {...register('role')}
                      type="radio"
                      value={option.value}
                      className="sr-only"
                    />
                    <div className="text-2xl mb-2">{option.icon}</div>
                    <div className="font-medium text-neutral-900 mb-1">
                      {option.label}
                    </div>
                    <div className="text-xs text-neutral-600 text-center">
                      {option.description}
                    </div>
                  </label>
                ))}
              </div>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
              )}
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700">
                  First Name
                </label>
                <input
                  {...register('firstName')}
                  type="text"
                  className={`
                    mt-1 appearance-none block w-full px-3 py-2 border rounded-lg 
                    placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                    ${errors.firstName ? 'border-red-300' : 'border-neutral-300'}
                  `}
                  placeholder="Enter your first name"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700">
                  Last Name
                </label>
                <input
                  {...register('lastName')}
                  type="text"
                  className={`
                    mt-1 appearance-none block w-full px-3 py-2 border rounded-lg 
                    placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                    ${errors.lastName ? 'border-red-300' : 'border-neutral-300'}
                  `}
                  placeholder="Enter your last name"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
                Email Address
              </label>
              <input
                {...register('email')}
                type="email"
                autoComplete="email"
                className={`
                  mt-1 appearance-none block w-full px-3 py-2 border rounded-lg 
                  placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                  ${errors.email ? 'border-red-300' : 'border-neutral-300'}
                `}
                placeholder="Enter your email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-neutral-700">
                Phone Number <span className="text-neutral-400">(optional)</span>
              </label>
              <input
                {...register('phone')}
                type="tel"
                className={`
                  mt-1 appearance-none block w-full px-3 py-2 border rounded-lg 
                  placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                  ${errors.phone ? 'border-red-300' : 'border-neutral-300'}
                `}
                placeholder="Enter your phone number"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            {/* Role-specific fields */}
            {watchedRole === 'farmer' && (
              <div className="space-y-4 p-4 bg-primary-50 rounded-lg">
                <h3 className="font-medium text-neutral-900">Farm Information</h3>
                <div>
                  <label htmlFor="farmName" className="block text-sm font-medium text-neutral-700">
                    Farm Name
                  </label>
                  <input
                    {...register('farmName')}
                    type="text"
                    className={`
                      mt-1 appearance-none block w-full px-3 py-2 border rounded-lg 
                      placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                      ${errors.farmName ? 'border-red-300' : 'border-neutral-300'}
                    `}
                    placeholder="Enter your farm name"
                  />
                  {errors.farmName && (
                    <p className="mt-1 text-sm text-red-600">{errors.farmName.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="farmAddress" className="block text-sm font-medium text-neutral-700">
                    Farm Address
                  </label>
                  <textarea
                    {...register('farmAddress')}
                    rows={2}
                    className={`
                      mt-1 appearance-none block w-full px-3 py-2 border rounded-lg 
                      placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                      ${errors.farmAddress ? 'border-red-300' : 'border-neutral-300'}
                    `}
                    placeholder="Enter your farm address"
                  />
                  {errors.farmAddress && (
                    <p className="mt-1 text-sm text-red-600">{errors.farmAddress.message}</p>
                  )}
                </div>
              </div>
            )}

            {watchedRole === 'middleman' && (
              <div className="space-y-4 p-4 bg-secondary-50 rounded-lg">
                <h3 className="font-medium text-neutral-900">Company Information</h3>
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-neutral-700">
                    Company Name
                  </label>
                  <input
                    {...register('companyName')}
                    type="text"
                    className={`
                      mt-1 appearance-none block w-full px-3 py-2 border rounded-lg 
                      placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                      ${errors.companyName ? 'border-red-300' : 'border-neutral-300'}
                    `}
                    placeholder="Enter your company name"
                  />
                  {errors.companyName && (
                    <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* Password Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    className={`
                      appearance-none block w-full px-3 py-2 pr-10 border rounded-lg 
                      placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                      ${errors.password ? 'border-red-300' : 'border-neutral-300'}
                    `}
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-neutral-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-neutral-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700">
                  Confirm Password
                </label>
                <div className="mt-1 relative">
                  <input
                    {...register('confirmPassword')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={`
                      appearance-none block w-full px-3 py-2 pr-10 border rounded-lg 
                      placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                      ${errors.confirmPassword ? 'border-red-300' : 'border-neutral-300'}
                    `}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-neutral-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-neutral-400" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isLoading ? (
                  <>
                    <InlineSpinner />
                    <span className="ml-2">Creating your account...</span>
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>

          {/* Terms */}
          <div className="mt-6 text-center">
            <p className="text-xs text-neutral-500">
              By creating an account, you agree to our{' '}
              <Link to="/terms" className="text-primary-600 hover:text-primary-500">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-primary-600 hover:text-primary-500">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
