/* global React, ReactDOM */

function DataTable() {
    const [data, setData] = React.useState([]);
    const [filteredData, setFilteredData] = React.useState([]);
    const [searchTerm, setSearchTerm] = React.useState('');

    React.useEffect(() => {
        fetch('data.json')
            .then(response => response.json())
            .then(jsonData => {
                setData(jsonData);
                setFilteredData(jsonData);
            });
    }, []);

    const [filters, setFilters] = React.useState({
        Name: '',
        Band: '',
        AlbType: '',
        Genre: '',
        Format: '',
        Date: ''
    });

    const handleFilterChange = (column, value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [column]: value
        }));
    };

    React.useEffect(() => {
        const filteredResults = data.filter(item =>
            Object.entries(filters).every(([key, value]) => {
                if (!value) return true;
                if (Array.isArray(item[key])) {
                    return item[key].some(v => v.toLowerCase().includes(value.toLowerCase()));
                }
                return item[key].toString().toLowerCase().includes(value.toLowerCase());
            })
        );
        setFilteredData(filteredResults);
    }, [filters, data]);

    React.useEffect(() => {
        const results = data.filter(item =>
            Object.values(item).some(value => 
                value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setFilteredData(results);
    }, [searchTerm, data]);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div className="container mt-5">
            <input
                type="text"
                className="form-control mb-3"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
            />
            <div className="row mb-3">
                <div className="col">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Filter by Name"
                        value={filters.Name}
                        onChange={(e) => handleFilterChange('Name', e.target.value)}
                    />
                </div>
                <div className="col">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Filter by Band"
                        value={filters.Band}
                        onChange={(e) => handleFilterChange('Band', e.target.value)}
                    />
                </div>
                <div className="col">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Filter by AlbType"
                        value={filters.AlbType}
                        onChange={(e) => handleFilterChange('AlbType', e.target.value)}
                    />
                </div>
                <div className="col">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Filter by Genre"
                        value={filters.Genre}
                        onChange={(e) => handleFilterChange('Genre', e.target.value)}
                    />
                </div>
                <div className="col">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Filter by Format"
                        value={filters.Format}
                        onChange={(e) => handleFilterChange('Format', e.target.value)}
                    />
                </div>
                <div className="col">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Filter by Date"
                        value={filters.Date}
                        onChange={(e) => handleFilterChange('Date', e.target.value)}
                    />
                </div>
            </div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Band</th>
                        <th>AlbType</th>
                        <th>Genre</th>
                        <th>Format</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((item, index) => (
                        <tr key={index}>
                            <td>{item.Name}</td>
                            <td>{item.Band.join(', ')}</td>
                            <td>{item.AlbType}</td>
                            <td>{item.Genre.join(', ')}</td>
                            <td>{item.Format.join(', ')}</td>
                            <td>{item.Date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

ReactDOM.render(<DataTable />, document.getElementById('root'));
