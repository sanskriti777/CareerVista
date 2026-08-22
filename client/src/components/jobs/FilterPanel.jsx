import "./FilterPanel.css";

function FilterPanel({
  location,
  setLocation,
  jobType,
  setJobType,
  experience,
  setExperience,
  sortBy,
  setSortBy,
  onResetFilters,
}) {
  return (
    <div className="filter-panel">
      <h3>Filters & Sorting</h3>

      <div className="filter-group">
        <label>Sort By</label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="latest">Latest Posted</option>
          <option value="salary-high">Highest Salary</option>
          <option value="company-az">Company Name (A-Z)</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Location</label>
        <select value={location} onChange={(e) => setLocation(e.target.value)}>
          <option value="">All Locations</option>
          <option value="Bangalore">Bangalore</option>
          <option value="Hyderabad">Hyderabad</option>
          <option value="Pune">Pune</option>
          <option value="Noida">Noida</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Job Type</label>
        <select value={jobType} onChange={(e) => setJobType(e.target.value)}>
          <option value="">All Job Types</option>
          <option value="Full Time">Full Time</option>
          <option value="Internship">Internship</option>
          <option value="Hybrid">Hybrid</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Experience</label>
        <select value={experience} onChange={(e) => setExperience(e.target.value)}>
          <option value="">All Experience</option>
          <option value="Fresher">Fresher</option>
          <option value="1-2 Years">1-2 Years</option>
          <option value="1-3 Years">1-3 Years</option>
          <option value="2-4 Years">2-4 Years</option>
        </select>
      </div>

      {onResetFilters && (
        <button onClick={onResetFilters}>
          Reset All Filters
        </button>
      )}
    </div>
  );
}

export default FilterPanel;