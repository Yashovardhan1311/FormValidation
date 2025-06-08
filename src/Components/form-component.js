import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';

const availableCountries = {
  India: ['New Delhi', 'Mumbai', 'Bangalore'],
  USA: ['New York', 'Chicago', 'Los Angeles'],
};

function RegistrationForm() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    dialCode: '+91',
    mobile: '',
    country: '',
    city: '',
    panCard: '',
    aadharCard: '',
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const checkValidity = () => {
    const errs = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
    const aadharPattern = /^[0-9]{12}$/;
    const phonePattern = /^[0-9]{10}$/;

    if (!inputs.firstName.trim()) errs.firstName = 'First Name cannot be empty';
    if (!inputs.lastName.trim()) errs.lastName = 'Last Name cannot be empty';
    if (!inputs.username.trim()) errs.username = 'Username cannot be blank';
    if (!emailPattern.test(inputs.email)) errs.email = 'Enter a valid email';
    if (!inputs.password) errs.password = 'Password is required';
    if (!phonePattern.test(inputs.mobile)) errs.mobile = 'Enter 10 digit number';
    if (!inputs.country) errs.country = 'Select a country';
    if (!inputs.city) errs.city = 'Select a city';
    if (!panPattern.test(inputs.panCard)) errs.panCard = 'Invalid PAN format';
    if (!aadharPattern.test(inputs.aadharCard)) errs.aadharCard = 'Aadhar must be 12 digits';

    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const updateField = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (checkValidity()) {
      navigate('/confirmation', { state: inputs });
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="max-w-2xl mx-auto p-6 space-y-4">
      {['firstName', 'lastName', 'username', 'email', 'mobile', 'panCard', 'aadharCard'].map((item) => (
        <div key={item}>
          <label className="block font-medium capitalize">{item.replace(/([A-Z])/g, ' $1')}</label>
          <input
            name={item}
            type={item === 'email' ? 'email' : 'text'}
            value={inputs[item]}
            onChange={updateField}
            className="border rounded-md w-full px-3 py-2"
          />
          {validationErrors[item] && <span className="text-red-500 text-sm">{validationErrors[item]}</span>}
        </div>
      ))}

      <div>
        <label>Password</label>
        <input
          type={isPasswordVisible ? 'text' : 'password'}
          name="password"
          value={inputs.password}
          onChange={updateField}
          className="border rounded-md w-full px-3 py-2"
        />
        <button type="button" onClick={() => setIsPasswordVisible(!isPasswordVisible)} className="text-blue-500 text-sm ml-2">
          {isPasswordVisible ? 'Hide' : 'Show'}
        </button>
        {validationErrors.password && <span className="text-red-500 text-sm block">{validationErrors.password}</span>}
      </div>

      <div>
        <label>Country</label>
        <select name="country" value={inputs.country} onChange={updateField} className="border rounded-md w-full px-3 py-2">
          <option value="">--Choose Country--</option>
          {Object.keys(availableCountries).map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {validationErrors.country && <span className="text-red-500 text-sm">{validationErrors.country}</span>}
      </div>

      <div>
        <label>City</label>
        <select name="city" value={inputs.city} onChange={updateField} className="border rounded-md w-full px-3 py-2">
          <option value="">--Choose City--</option>
          {inputs.country && availableCountries[inputs.country].map((cty) => (
            <option key={cty} value={cty}>{cty}</option>
          ))}
        </select>
        {validationErrors.city && <span className="text-red-500 text-sm">{validationErrors.city}</span>}
      </div>

      <div>
        <label>Dial Code</label>
        <input
          name="dialCode"
          value={inputs.dialCode}
          onChange={updateField}
          className="border rounded-md w-full px-3 py-2"
        />
      </div>

      <button type="submit" disabled={!checkValidity()} className="bg-green-600 text-white px-5 py-2 rounded disabled:bg-gray-400">
        Submit Form
      </button>
    </form>
  );
}

function ConfirmationPage() {
  const location = useLocation();
  const userData = location.state;
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Your Submitted Information</h1>
      <pre className="bg-gray-100 p-4 rounded-lg shadow-md">{JSON.stringify(userData, null, 2)}</pre>
    </div>
  );
}

export default function MainApp() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegistrationForm />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
      </Routes>
    </Router>
  );
}
