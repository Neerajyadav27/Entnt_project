import React, { useState } from "react";
import { useCommunication } from "../context/data";
import "./companies.css";

function CompanyListPage() {
  const {
    state,
    updateCompany,
    deleteCompany,
    addCompanyCommunicationMethod,
    updateCompanyCommunicationMethod,
    deleteCompanyCommunicationMethod,
  } = useCommunication();

  // Company Edit State
  const [editingCompany, setEditingCompany] = useState(null);

  // Communication Method Edit State
  const [editingMethod, setEditingMethod] = useState(null);

  // Company Form State
  const [companyForm, setCompanyForm] = useState({
    id: "",
    name: "",
    location: "",
    linkedinProfile: "",
    emails: [""],
    phoneNumbers: [""],
    comments: "",
    communicationPeriodicity: 14,
    communicationMethods: [],
  });

  // Communication Method Form State
  const [methodForm, setMethodForm] = useState({
    id: "",
    name: "",
    description: "",
    sequence: 0,
    isMandatory: false,
    companyId: null,
  });

  // Company Form Handlers
  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setCompanyForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmailChange = (index, value) => {
    const newEmails = [...companyForm.emails];
    newEmails[index] = value;
    setCompanyForm((prev) => ({ ...prev, emails: newEmails }));
  };

  const handleAddEmail = () => {
    setCompanyForm((prev) => ({
      ...prev,
      emails: [...prev.emails, ""],
    }));
  };

  const handlePhoneChange = (index, value) => {
    const newPhones = [...companyForm.phoneNumbers];
    newPhones[index] = value;
    setCompanyForm((prev) => ({ ...prev, phoneNumbers: newPhones }));
  };

  const handleAddPhone = () => {
    setCompanyForm((prev) => ({
      ...prev,
      phoneNumbers: [...prev.phoneNumbers, ""],
    }));
  };

  // Start Editing Company
  const startEditCompany = (company) => {
    setEditingCompany(company.id);
    setCompanyForm({ ...company });
  };

  // Update Company
  const handleUpdateCompany = (e) => {
    e.preventDefault();
    updateCompany(companyForm);
    setEditingCompany(null);
  };

  // Communication Method Handlers
  const handleMethodChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMethodForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Start Editing Method
  const startEditMethod = (method, companyId) => {
    setEditingMethod({ methodId: method.id, companyId });
    setMethodForm({
      ...method,
      companyId: companyId,
    });
  };

  // Update Communication Method
  const handleUpdateMethod = (e) => {
    e.preventDefault();
    updateCompanyCommunicationMethod(methodForm);
    setEditingMethod(null);
  };

  // Add New Method to Company
  const handleAddMethod = (companyId) => {
    const newMethod = {
      ...methodForm,
      companyId,
      id: "", // Reset ID to create new method
      sequence:
        state.companies.find((c) => c.id === companyId).communicationMethods
          .length + 1,
    };
    addCompanyCommunicationMethod(newMethod);
    // Reset method form
    setMethodForm({
      id: "",
      name: "",
      description: "",
      sequence: 0,
      isMandatory: false,
      companyId: null,
    });
  };

  const renderContactDetails = (company) => {
    return (
      <div className="contact-details">
        {/* Emails Section */}
        <div className="contact-section">
          <h4>Emails</h4>
          {company.emails && company.emails.length > 0 ? (
            <ul>
              {company.emails.map((email, index) => (
                <li key={index}>
                  <span className="email-icon">✉️</span> {email}
                </li>
              ))}
            </ul>
          ) : (
            <p>No email addresses</p>
          )}
        </div>

        {/* Phone Numbers Section */}
        <div className="contact-section">
          <h4>Phone Numbers</h4>
          {company.phoneNumbers && company.phoneNumbers.length > 0 ? (
            <ul>
              {company.phoneNumbers.map((phone, index) => (
                <li key={index}>
                  <span className="phone-icon">📞</span> {phone}
                </li>
              ))}
            </ul>
          ) : (
            <p>No phone numbers</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="company-list-page">
      <h1>Companies</h1>
      <div className="company-list">
      {state.companies.map((company) => (
        <div key={company.id} className="company-card">
          {editingCompany === company.id ? (
            <form onSubmit={handleUpdateCompany} className="edit-company-form">
             <div className="form-row">
                <input
                  type="text"
                  name="name"
                  value={companyForm.name}
                  onChange={handleCompanyChange}
                  placeholder="Company Name"
                  required
                />
                <input
                  type="text"
                  name="location"
                  value={companyForm.location}
                  onChange={handleCompanyChange}
                  placeholder="Location"
                />
              </div>

              <div className="form-row">
                <input
                  type="url"
                  name="linkedinProfile"
                  value={companyForm.linkedinProfile}
                  onChange={handleCompanyChange}
                  placeholder="LinkedIn Profile"
                />
                <input
                  type="number"
                  name="communicationPeriodicity"
                  value={companyForm.communicationPeriodicity}
                  onChange={handleCompanyChange}
                  placeholder="Communication Frequency (days)"
                />
              </div>

              <div className="contact-management">
                <div className="email-management">
                  <h4>Emails</h4>
                  {companyForm.emails.map((email, index) => (
                    <div key={index} className="contact-input">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => handleEmailChange(index, e.target.value)}
                        placeholder="Email Address"
                      />
                      {index === companyForm.emails.length - 1 && (
                        <button type="button" onClick={handleAddEmail}>
                          +
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="phone-management">
                  <h4>Phone Numbers</h4>
                  {companyForm.phoneNumbers.map((phone, index) => (
                    <div key={index} className="contact-input">
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => handlePhoneChange(index, e.target.value)}
                        placeholder="Phone Number"
                      />
                      {index === companyForm.phoneNumbers.length - 1 && (
                        <button type="button" onClick={handleAddPhone}>
                          +
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <textarea
                name="comments"
                value={companyForm.comments}
                onChange={handleCompanyChange}
                placeholder="Additional Comments"
                rows="3"
              />

              <div className="form-actions">
                <button type="submit">Save Changes</button>
                <button type="button" onClick={() => setEditingCompany(null)}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="company-details">
              <h2>{company.name}</h2>
              <p>Location: {company.location}</p>
              <p>LinkedIn: {company.linkedinProfile || "N/A"}</p>
              <p>
                Communication Frequency: {company.communicationPeriodicity} days
              </p>

              {renderContactDetails(company)}

              <div className="company-actions">
                <button onClick={() => startEditCompany(company)}>
                  Edit Company
                </button>
                <button onClick={() => deleteCompany(company.id)}>
                  Delete Company
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
        </div>
    </div>
  );
}

export default CompanyListPage;


