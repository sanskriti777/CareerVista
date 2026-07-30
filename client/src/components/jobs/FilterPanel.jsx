import "./FilterPanel.css";

function FilterPanel({
  location,
  setLocation,
  jobType,
  setJobType,
}) {
  return (
    <div className="filter-panel">
      <h3>Filters</h3>

      <select
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      >
        <option value="">All Locations</option>
        <option value="Bangalore">Bangalore</option>
        <option value="Hyderabad">Hyderabad</option>
        <option value="Pune">Pune</option>
        <option value="Noida">Noida</option>
      </select>

      <select
        value={jobType}
        onChange={(e) => setJobType(e.target.value)}
      >
        <option value="">All Job Types</option>
        <option value="Full Time">Full Time</option>
        <option value="Internship">Internship</option>
        <option value="Hybrid">Hybrid</option>
      </select>
    </div>
  );
}

export default FilterPanel;