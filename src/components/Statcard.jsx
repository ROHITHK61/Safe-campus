function StatCard({ title, number, color, icon }) {
  return (
    <div className={`stat-card ${color}`}>

      <div className="stat-icon">
        {icon}
      </div>

      <div className="stat-info">
        <h4>{title}</h4>
        <h2>{number}</h2>
        <p>Active Incidents</p>
      </div>

    </div>
  );
}

export default StatCard;