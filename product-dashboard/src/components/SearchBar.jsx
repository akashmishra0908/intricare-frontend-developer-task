const SearchBar = ({ search, setSearch }) => {
    return (
        <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: "8px", width: "300px", marginBottom: "20px" }}
        />
    );
};

export default SearchBar;
