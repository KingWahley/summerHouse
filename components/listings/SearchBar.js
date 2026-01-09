export default function SearchBar({ value, onChange }) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="Location, keyword, property name"
      className="md:col-span-2 border p-3 rounded-md"
    />
  );
}
