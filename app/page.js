import Link from "next/link";

export default function Home() {
  const categories = [
    {
      title: "Event Planners",
      tagline: "End-to-end organizers",
      description: "Find experienced coordinators for weddings, corporate galas, private dinners, and festivals.",
      filter: "planner",
    },
    {
      title: "Live Performers",
      tagline: "Stage & musical talent",
      description: "Book singers, live bands, DJs, dancers, comedians, and specialty entertainment acts.",
      filter: "performer",
    },
    {
      title: "Production Crew",
      tagline: "Technical & ground support",
      description: "Hire sound engineers, lighting techs, stagehands, camera operators, and logistics teams.",
      filter: "crew",
    },
  ];

  return (
    <div className="home-wrapper">
      <section className="hero">
        <span className="hero-pill">Event Service Marketplace</span>
        <h1 className="hero-title">Hire the right people for your next event.</h1>
        <p className="hero-subtitle">
          Whether you need a full-scale planner, an energetic live performer, or on-ground production crew, post your requirements and get connected.
        </p>
        <div className="hero-actions">
          <Link href="/post-requirement" className="btn btn-primary">
            Post an Event Need
          </Link>
          <Link href="/requirements" className="btn btn-secondary">
            Explore Open Requests
          </Link>
        </div>
      </section>

      <section className="categories-section">
        <div className="section-header">
          <h2>Looking for talent or ready to assist?</h2>
          <p>Choose a category to browse active gigs and requirements.</p>
        </div>

        <div className="categories-grid">
          {categories.map((cat) => (
            <Link
              key={cat.filter}
              href={`/requirements?category=${cat.filter}`}
              className="category-card"
            >
              <div className="card-badge">{cat.tagline}</div>
              <h3>{cat.title}</h3>
              <p>{cat.description}</p>
              <span className="card-cta">Browse {cat.title} →</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
