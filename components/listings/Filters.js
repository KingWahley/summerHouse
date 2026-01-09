export default function Filters({ filters, setFilters }) {
  return (
    <>
      <select
        className="border p-3 rounded-md"
        value={filters.type}
        onChange={e =>
          setFilters({ ...filters, type: e.target.value })
        }
      >
        <option value="">All Types</option>
        <option value="apartment">Apartment</option>
        <option value="house">House</option>
        <option value="land">Land</option>
        <option value="commercial">Commercial</option>
      </select>

      <input
        type="number"
        placeholder="Min price"
        className="border p-3 rounded-md"
        value={filters.minPrice}
        onChange={e =>
          setFilters({ ...filters, minPrice: e.target.value })
        }
      />

      <input
        type="number"
        placeholder="Max price"
        className="border p-3 rounded-md"
        value={filters.maxPrice}
        onChange={e =>
          setFilters({ ...filters, maxPrice: e.target.value })
        }
      />
    </>
  );
}
