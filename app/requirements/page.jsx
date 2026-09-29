"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function RequirementsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeCategory = searchParams.get("category") || "all";
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const filters = [
    { label: "All Requests", value: "all" },
    { label: "Planners", value: "planner" },
    { label: "Performers", value: "performer" },
    { label: "Production Crew", value: "crew" },
  ];

  useEffect(() => {
    let isMounted = true;

    async function loadRequirements() {
      setLoading(true);
      setError("");

      try {
        const queryParam = activeCategory !== "all" ? `?category=${encodeURIComponent(activeCategory)}` : "";
        const res = await fetch(`/api/requirements${queryParam}`);

        if (!res.ok) {
          throw new Error("Unable to load requirements. Please try again.");
        }

        const data = await res.json();
        if (isMounted) setItems(data);
      } catch (err) {
        if (isMounted) setError(err.message || "Failed to load requirements.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadRequirements();

    return () => {
      isMounted = false;
    };
  }, [activeCategory]);

  function handleFilterClick(category) {
    if (category === "all") {
      router.push("/requirements");
    } else {
      router.push(`/requirements?category=${category}`);
    }
  }

  function formatDate(dateStr) {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1>Active Requirements</h1>
          <p className="page-desc">Browse event gigs, planning needs, and talent requests.</p>
        </div>
        <Link href="/post-requirement" className="btn btn-primary">
          + Post Requirement
        </Link>
      </div>

      <div className="filters-bar">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            className={`filter-chip ${activeCategory === f.value ? "active" : ""}`}
            onClick={() => handleFilterClick(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="loading-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="requirement-card skeleton-card">
              <div className="skeleton-line" style={{ width: "40%", height: 20 }}></div>
              <div className="skeleton-line" style={{ width: "70%", height: 14, marginTop: 12 }}></div>
              <div className="skeleton-line" style={{ width: "55%", height: 14, marginTop: 8 }}></div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="alert-box error-box">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No requirements found</h3>
          <p>
            {activeCategory === "all"
              ? "There are currently no posted event requirements. Be the first to post!"
              : `There are currently no requests in the "${activeCategory}" category.`}
          </p>
          <Link href="/post-requirement" className="btn btn-primary" style={{ marginTop: 16 }}>
            Post a Requirement
          </Link>
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="requirements-grid">
          {items.map((item) => (
            <div key={item._id} className="requirement-card">
              <div className="card-top">
                <span className={`category-tag tag-${item.category}`}>
                  {item.category.toUpperCase()}
                </span>
                <span className="event-date">
                  {formatDate(item.startDate)}
                  {item.endDate ? ` — ${formatDate(item.endDate)}` : ""}
                </span>
              </div>

              <h2 className="card-title">{item.eventName}</h2>
              <p className="card-meta">
                <span>📍 {item.location}{item.venue ? ` (${item.venue})` : ""}</span>
                <span>•</span>
                <span>🎪 {item.eventType}</span>
              </p>

              <div className="card-details-box">
                {item.category === "planner" && item.plannerDetails && (
                  <>
                    <p>
                      <strong>Services:</strong>{" "}
                      {item.plannerDetails.servicesNeeded?.length
                        ? item.plannerDetails.servicesNeeded.join(", ")
                        : "General coordination"}
                    </p>
                    {item.plannerDetails.guestCount ? (
                      <p><strong>Estimated Guests:</strong> {item.plannerDetails.guestCount}</p>
                    ) : null}
                    {item.plannerDetails.budget ? (
                      <p><strong>Budget:</strong> ₹{Number(item.plannerDetails.budget).toLocaleString()}</p>
                    ) : null}
                  </>
                )}

                {item.category === "performer" && item.performerDetails && (
                  <>
                    <p>
                      <strong>Act:</strong> {item.performerDetails.performerType || "Performer"}{" "}
                      {item.performerDetails.genre ? `(${item.performerDetails.genre})` : ""}
                    </p>
                    <p><strong>Performers Needed:</strong> {item.performerDetails.performersRequired || 1}</p>
                    {item.performerDetails.budget ? (
                      <p><strong>Budget:</strong> ₹{Number(item.performerDetails.budget).toLocaleString()}</p>
                    ) : null}
                  </>
                )}

                {item.category === "crew" && item.crewDetails && (
                  <>
                    <p>
                      <strong>Roles:</strong>{" "}
                      {item.crewDetails.crewRoles?.length
                        ? item.crewDetails.crewRoles.join(", ")
                        : "Event support"}
                    </p>
                    <p><strong>Crew Size:</strong> {item.crewDetails.crewSize || 1} people</p>
                    {item.crewDetails.dailyRate ? (
                      <p><strong>Daily Rate:</strong> ₹{Number(item.crewDetails.dailyRate).toLocaleString()} / person</p>
                    ) : null}
                  </>
                )}
              </div>

              <div className="card-footer">
                <div className="contact-info">
                  <span className="contact-label">Contact:</span>
                  <strong>{item.contactName}</strong>
                </div>
                <a
                  href={`mailto:${item.contactEmail}?subject=Regarding requirement: ${encodeURIComponent(item.eventName)}`}
                  className="btn btn-sm btn-outline"
                >
                  Contact Organizer
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function RequirementsPage() {
  return (
    <Suspense fallback={<div className="container"><p>Loading requirements...</p></div>}>
      <RequirementsContent />
    </Suspense>
  );
}
