"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const EVENT_TYPES = [
  "Wedding",
  "Corporate Event",
  "Concert / Live Show",
  "Birthday Party",
  "Conference / Seminar",
  "Festival / Fair",
  "Private Gathering",
  "Other",
];

const PLANNER_SERVICES = [
  "Full Event Planning",
  "Day-of Coordination",
  "Venue Selection",
  "Catering Management",
  "Decor & Design",
  "Photography & Video",
  "Guest Hospitality",
];

const PERFORMER_ROLES = [
  "Singer / Vocalist",
  "Live Band",
  "DJ",
  "Dancer / Dance Troupe",
  "Anchor / Emcee",
  "Comedian",
  "Magician / Illusionist",
  "Instrumentalist",
];

const CREW_ROLES = [
  "Sound / Audio Engineer",
  "Lighting Technician",
  "Stagehand / Rigging",
  "Camera Operator",
  "Visuals / LED Tech",
  "Security Personnel",
  "General Event Crew",
];

export default function PostRequirementPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [submittedId, setSubmittedId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Basics
    eventName: "",
    eventType: "",
    dateType: "single",
    startDate: "",
    endDate: "",
    location: "",
    venue: "",
    category: "planner",

    // Step 2: Category Details
    // Planner
    servicesNeeded: [],
    guestCount: "",
    planningStage: "Planning in progress",
    // Performer
    performerType: "",
    genre: "",
    performersRequired: 1,
    durationHours: 2,
    // Crew
    crewRoles: [],
    crewSize: 2,
    shiftTiming: "Full Day (8 hrs)",
    experienceRequired: "1+ years",

    // Step 3: Budget & Contact
    budget: "",
    dailyRate: "",
    notes: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
  });

  function updateField(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormError("");
  }

  function toggleArrayItem(field, item) {
    setFormData((prev) => {
      const list = prev[field] || [];
      const updated = list.includes(item)
        ? list.filter((i) => i !== item)
        : [...list, item];
      return { ...prev, [field]: updated };
    });
    setFormError("");
  }

  function validateStep(step) {
    if (step === 1) {
      if (!formData.eventName.trim()) return "Please enter the event name.";
      if (!formData.eventType) return "Please select the event type.";
      if (!formData.startDate) return "Please pick a date for your event.";
      if (formData.dateType === "range") {
        if (!formData.endDate) return "Please choose an end date for the date range.";
        if (new Date(formData.endDate) < new Date(formData.startDate)) {
          return "End date cannot be earlier than start date.";
        }
      }
      if (!formData.location.trim()) return "Please enter the event location/city.";
      if (!formData.category) return "Please choose what type of service you need.";
    }

    if (step === 2) {
      if (formData.category === "planner") {
        if (!formData.servicesNeeded.length) {
          return "Please select at least one planning service you require.";
        }
      } else if (formData.category === "performer") {
        if (!formData.performerType) {
          return "Please choose the type of performer you are hiring.";
        }
      } else if (formData.category === "crew") {
        if (!formData.crewRoles.length) {
          return "Please select at least one crew role required.";
        }
      }
    }

    if (step === 3) {
      if (formData.category === "crew") {
        if (!formData.dailyRate) return "Please specify an expected daily rate.";
      } else {
        if (!formData.budget) return "Please enter your estimated budget.";
      }

      if (!formData.contactName.trim()) return "Please provide your contact name.";
      if (!formData.contactEmail.trim() || !formData.contactEmail.includes("@")) {
        return "Please provide a valid contact email.";
      }
    }

    return null;
  }

  function handleNext() {
    const error = validateStep(currentStep);
    if (error) {
      setFormError(error);
      return;
    }
    setFormError("");
    setCurrentStep((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleBack() {
    setFormError("");
    setCurrentStep((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);

    try {
      const details = {};
      if (formData.category === "planner") {
        details.servicesNeeded = formData.servicesNeeded;
        details.guestCount = Number(formData.guestCount) || 0;
        details.planningStage = formData.planningStage;
        details.budget = Number(formData.budget) || 0;
        details.notes = formData.notes;
      } else if (formData.category === "performer") {
        details.performerType = formData.performerType;
        details.genre = formData.genre;
        details.performersRequired = Number(formData.performersRequired) || 1;
        details.durationHours = Number(formData.durationHours) || 1;
        details.budget = Number(formData.budget) || 0;
        details.notes = formData.notes;
      } else if (formData.category === "crew") {
        details.crewRoles = formData.crewRoles;
        details.crewSize = Number(formData.crewSize) || 1;
        details.shiftTiming = formData.shiftTiming;
        details.dailyRate = Number(formData.dailyRate) || 0;
        details.notes = formData.notes;
      }

      const payload = {
        eventName: formData.eventName,
        eventType: formData.eventType,
        dateType: formData.dateType,
        startDate: formData.startDate,
        endDate: formData.dateType === "range" ? formData.endDate : null,
        location: formData.location,
        venue: formData.venue,
        category: formData.category,
        details,
        contactName: formData.contactName,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
      };

      const res = await fetch("/api/requirements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to post requirement.");
      }

      setSubmittedId(result._id);
    } catch (err) {
      setFormError(err.message || "Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submittedId) {
    return (
      <div className="container form-container">
        <div className="success-card">
          <div className="success-icon">✓</div>
          <h2>Requirement Posted Successfully!</h2>
          <p>
            Your event need has been submitted and is now listed for candidates and service providers.
          </p>
          <div className="success-actions">
            <Link href="/requirements" className="btn btn-primary">
              View All Requirements
            </Link>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setSubmittedId(null);
                setCurrentStep(1);
                setFormData({
                  eventName: "",
                  eventType: "",
                  dateType: "single",
                  startDate: "",
                  endDate: "",
                  location: "",
                  venue: "",
                  category: "planner",
                  servicesNeeded: [],
                  guestCount: "",
                  planningStage: "Planning in progress",
                  performerType: "",
                  genre: "",
                  performersRequired: 1,
                  durationHours: 2,
                  crewRoles: [],
                  crewSize: 2,
                  shiftTiming: "Full Day (8 hrs)",
                  experienceRequired: "1+ years",
                  budget: "",
                  dailyRate: "",
                  notes: "",
                  contactName: "",
                  contactEmail: "",
                  contactPhone: "",
                });
              }}
            >
              Post Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container form-container">
      <div className="form-header">
        <h1>Post an Event Requirement</h1>
        <p>Tell us what service or talent you need for your upcoming event.</p>
      </div>

      {/* Step Indicator */}
      <div className="stepper">
        {[
          { step: 1, label: "Basics" },
          { step: 2, label: "Details" },
          { step: 3, label: "Budget & Contact" },
          { step: 4, label: "Review" },
        ].map((item) => (
          <div
            key={item.step}
            className={`step-item ${currentStep === item.step ? "active" : currentStep > item.step ? "completed" : ""}`}
          >
            <span className="step-number">{currentStep > item.step ? "✓" : item.step}</span>
            <span className="step-label">{item.label}</span>
          </div>
        ))}
      </div>

      {formError && (
        <div className="alert-box error-box">
          <p>{formError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-body">
        {/* Step 1: Basics */}
        {currentStep === 1 && (
          <div className="form-step-content">
            <h2 className="step-heading">Event Overview</h2>

            <div className="form-group">
              <label htmlFor="eventName">Event Name *</label>
              <input
                id="eventName"
                type="text"
                placeholder="e.g. Annual Tech Symposium, Maya's Wedding"
                value={formData.eventName}
                onChange={(e) => updateField("eventName", e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="eventType">Event Type *</label>
                <select
                  id="eventType"
                  value={formData.eventType}
                  onChange={(e) => updateField("eventType", e.target.value)}
                >
                  <option value="">Select type</option>
                  {EVENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Date Type</label>
                <div className="radio-pills">
                  <button
                    type="button"
                    className={`pill-btn ${formData.dateType === "single" ? "selected" : ""}`}
                    onClick={() => updateField("dateType", "single")}
                  >
                    Single Day
                  </button>
                  <button
                    type="button"
                    className={`pill-btn ${formData.dateType === "range" ? "selected" : ""}`}
                    onClick={() => updateField("dateType", "range")}
                  >
                    Multiple Days
                  </button>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startDate">
                  {formData.dateType === "range" ? "Start Date *" : "Event Date *"}
                </label>
                <input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => updateField("startDate", e.target.value)}
                />
              </div>

              {formData.dateType === "range" && (
                <div className="form-group">
                  <label htmlFor="endDate">End Date *</label>
                  <input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => updateField("endDate", e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="location">City / Location *</label>
                <input
                  id="location"
                  type="text"
                  placeholder="e.g. Mumbai, New Delhi, Bengaluru"
                  value={formData.location}
                  onChange={(e) => updateField("location", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="venue">Venue (Optional)</label>
                <input
                  id="venue"
                  type="text"
                  placeholder="e.g. Grand Hyatt, Outdoor Lawn"
                  value={formData.venue}
                  onChange={(e) => updateField("venue", e.target.value)}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: 24 }}>
              <label>What type of professional do you need? *</label>
              <div className="selection-cards">
                {[
                  {
                    id: "planner",
                    title: "Event Planner",
                    desc: "Professional coordinator for budgeting, decor, vendors, and scheduling.",
                  },
                  {
                    id: "performer",
                    title: "Performer / Artist",
                    desc: "Singers, musicians, bands, dancers, DJs, and entertainment acts.",
                  },
                  {
                    id: "crew",
                    title: "Production Crew",
                    desc: "Technical hands, sound & lighting technicians, stage crew, or operations staff.",
                  },
                ].map((cat) => (
                  <div
                    key={cat.id}
                    className={`select-card ${formData.category === cat.id ? "selected" : ""}`}
                    onClick={() => updateField("category", cat.id)}
                  >
                    <div className="card-radio-circle">
                      {formData.category === cat.id ? "●" : ""}
                    </div>
                    <div>
                      <strong>{cat.title}</strong>
                      <p>{cat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Category Details */}
        {currentStep === 2 && (
          <div className="form-step-content">
            <h2 className="step-heading">
              {formData.category === "planner" && "Planning Requirements"}
              {formData.category === "performer" && "Performance & Artist Details"}
              {formData.category === "crew" && "Crew & Technical Specifications"}
            </h2>

            {formData.category === "planner" && (
              <>
                <div className="form-group">
                  <label>Services Required * (Select all that apply)</label>
                  <div className="checkbox-pills">
                    {PLANNER_SERVICES.map((s) => (
                      <button
                        type="button"
                        key={s}
                        className={`pill-check ${formData.servicesNeeded.includes(s) ? "checked" : ""}`}
                        onClick={() => toggleArrayItem("servicesNeeded", s)}
                      >
                        {formData.servicesNeeded.includes(s) ? "✓ " : "+ "}
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="guestCount">Expected Guest Count</label>
                    <input
                      id="guestCount"
                      type="number"
                      placeholder="e.g. 250"
                      value={formData.guestCount}
                      onChange={(e) => updateField("guestCount", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="planningStage">Planning Stage</label>
                    <select
                      id="planningStage"
                      value={formData.planningStage}
                      onChange={(e) => updateField("planningStage", e.target.value)}
                    >
                      <option>Just exploring concepts</option>
                      <option>Planning in progress</option>
                      <option>Ready to finalize & book</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {formData.category === "performer" && (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="performerType">Performer Type *</label>
                    <select
                      id="performerType"
                      value={formData.performerType}
                      onChange={(e) => updateField("performerType", e.target.value)}
                    >
                      <option value="">Select artist category</option>
                      {PERFORMER_ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="genre">Genre / Style (Optional)</label>
                    <input
                      id="genre"
                      type="text"
                      placeholder="e.g. Acoustic Indie, Bollywood, Jazz, Hip-hop"
                      value={formData.genre}
                      onChange={(e) => updateField("genre", e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="performersRequired">Number of Performers</label>
                    <input
                      id="performersRequired"
                      type="number"
                      min="1"
                      value={formData.performersRequired}
                      onChange={(e) => updateField("performersRequired", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="durationHours">Set Duration (Hours)</label>
                    <input
                      id="durationHours"
                      type="number"
                      step="0.5"
                      min="0.5"
                      value={formData.durationHours}
                      onChange={(e) => updateField("durationHours", e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            {formData.category === "crew" && (
              <>
                <div className="form-group">
                  <label>Roles Needed * (Select all that apply)</label>
                  <div className="checkbox-pills">
                    {CREW_ROLES.map((r) => (
                      <button
                        type="button"
                        key={r}
                        className={`pill-check ${formData.crewRoles.includes(r) ? "checked" : ""}`}
                        onClick={() => toggleArrayItem("crewRoles", r)}
                      >
                        {formData.crewRoles.includes(r) ? "✓ " : "+ "}
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="crewSize">Crew Members Required</label>
                    <input
                      id="crewSize"
                      type="number"
                      min="1"
                      value={formData.crewSize}
                      onChange={(e) => updateField("crewSize", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="shiftTiming">Shift Timing</label>
                    <input
                      id="shiftTiming"
                      type="text"
                      placeholder="e.g. 10:00 AM - 6:00 PM"
                      value={formData.shiftTiming}
                      onChange={(e) => updateField("shiftTiming", e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Step 3: Budget & Contact */}
        {currentStep === 3 && (
          <div className="form-step-content">
            <h2 className="step-heading">Budget & Contact Details</h2>

            {formData.category === "crew" ? (
              <div className="form-group">
                <label htmlFor="dailyRate">Daily Rate Per Person (₹) *</label>
                <input
                  id="dailyRate"
                  type="number"
                  placeholder="e.g. 3500"
                  value={formData.dailyRate}
                  onChange={(e) => updateField("dailyRate", e.target.value)}
                />
              </div>
            ) : (
              <div className="form-group">
                <label htmlFor="budget">Estimated Budget (₹) *</label>
                <input
                  id="budget"
                  type="number"
                  placeholder="e.g. 50000"
                  value={formData.budget}
                  onChange={(e) => updateField("budget", e.target.value)}
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="notes">Additional Requirements or Notes</label>
              <textarea
                id="notes"
                rows="3"
                placeholder="Mention any specific preferences, equipment, setup requirements..."
                value={formData.notes}
                onChange={(e) => updateField("notes", e.target.value)}
              />
            </div>

            <div className="section-divider"></div>
            <h3 style={{ fontSize: 16, marginBottom: 12 }}>Organizer Contact Details</h3>

            <div className="form-group">
              <label htmlFor="contactName">Contact Name *</label>
              <input
                id="contactName"
                type="text"
                placeholder="Full name"
                value={formData.contactName}
                onChange={(e) => updateField("contactName", e.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contactEmail">Contact Email *</label>
                <input
                  id="contactEmail"
                  type="email"
                  placeholder="you@domain.com"
                  value={formData.contactEmail}
                  onChange={(e) => updateField("contactEmail", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="contactPhone">Phone Number (Optional)</label>
                <input
                  id="contactPhone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.contactPhone}
                  onChange={(e) => updateField("contactPhone", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {currentStep === 4 && (
          <div className="form-step-content">
            <h2 className="step-heading">Review & Confirm</h2>
            <p className="page-desc">Please verify your details before posting.</p>

            <div className="review-card">
              <div className="review-section">
                <h3>Event Overview</h3>
                <div className="review-grid">
                  <div>
                    <span className="review-label">Event:</span>
                    <strong>{formData.eventName}</strong>
                  </div>
                  <div>
                    <span className="review-label">Category:</span>
                    <strong style={{ textTransform: "capitalize" }}>{formData.category}</strong>
                  </div>
                  <div>
                    <span className="review-label">Type:</span>
                    <span>{formData.eventType}</span>
                  </div>
                  <div>
                    <span className="review-label">Location:</span>
                    <span>{formData.location}{formData.venue ? ` (${formData.venue})` : ""}</span>
                  </div>
                  <div>
                    <span className="review-label">Date:</span>
                    <span>
                      {formData.startDate}
                      {formData.dateType === "range" && formData.endDate ? ` to ${formData.endDate}` : ""}
                    </span>
                  </div>
                </div>
              </div>

              <div className="review-section">
                <h3>Requirements</h3>
                {formData.category === "planner" && (
                  <div className="review-grid">
                    <div>
                      <span className="review-label">Services:</span>
                      <span>{formData.servicesNeeded.join(", ") || "None specified"}</span>
                    </div>
                    {formData.guestCount ? (
                      <div>
                        <span className="review-label">Guests:</span>
                        <span>{formData.guestCount}</span>
                      </div>
                    ) : null}
                    <div>
                      <span className="review-label">Budget:</span>
                      <strong>₹{Number(formData.budget).toLocaleString()}</strong>
                    </div>
                  </div>
                )}

                {formData.category === "performer" && (
                  <div className="review-grid">
                    <div>
                      <span className="review-label">Artist:</span>
                      <span>{formData.performerType} {formData.genre ? `(${formData.genre})` : ""}</span>
                    </div>
                    <div>
                      <span className="review-label">Required:</span>
                      <span>{formData.performersRequired} artist(s) for {formData.durationHours} hr(s)</span>
                    </div>
                    <div>
                      <span className="review-label">Budget:</span>
                      <strong>₹{Number(formData.budget).toLocaleString()}</strong>
                    </div>
                  </div>
                )}

                {formData.category === "crew" && (
                  <div className="review-grid">
                    <div>
                      <span className="review-label">Roles:</span>
                      <span>{formData.crewRoles.join(", ")}</span>
                    </div>
                    <div>
                      <span className="review-label">Crew:</span>
                      <span>{formData.crewSize} people · {formData.shiftTiming}</span>
                    </div>
                    <div>
                      <span className="review-label">Daily Rate:</span>
                      <strong>₹{Number(formData.dailyRate).toLocaleString()} / person</strong>
                    </div>
                  </div>
                )}

                {formData.notes && (
                  <div style={{ marginTop: 10 }}>
                    <span className="review-label">Notes:</span>
                    <p style={{ margin: "4px 0 0", color: "#444" }}>{formData.notes}</p>
                  </div>
                )}
              </div>

              <div className="review-section">
                <h3>Contact</h3>
                <div className="review-grid">
                  <div>
                    <span className="review-label">Name:</span>
                    <span>{formData.contactName}</span>
                  </div>
                  <div>
                    <span className="review-label">Email:</span>
                    <span>{formData.contactEmail}</span>
                  </div>
                  {formData.contactPhone && (
                    <div>
                      <span className="review-label">Phone:</span>
                      <span>{formData.contactPhone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="form-nav">
          {currentStep > 1 ? (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleBack}
              disabled={submitting}
            >
              ← Back
            </button>
          ) : (
            <div></div>
          )}

          {currentStep < 4 ? (
            <button type="button" className="btn btn-primary" onClick={handleNext}>
              Continue →
            </button>
          ) : (
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Submitting Request..." : "Post Requirement"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
