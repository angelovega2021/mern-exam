import { useState, useEffect, useRef } from 'react';
import FlightDetails from './FlightDetails';
import './App.css';

const FlightNumberList = () => {
    const PAGE_SIZE = 4; 
    const [allItems, setAllItems] = useState([]); 
    const [visibleItems, setVisibleItems] = useState([]);
    const [hasMore, setHasMore] = useState(true); 
    const [searchQuery, setSearchQuery] = useState('');
    const scrollRef = useRef(null);

    useEffect(() => {
        const fetchAllItems = async () => {
            try {
                const response = await fetch('https://api.spacexdata.com/v3/launches');
                const data = await response.json();
                setAllItems(data);
                setVisibleItems(data.slice(0, PAGE_SIZE));
            } catch (error) {
                console.error('Error fetching flight numbers:', error);
            }
        };
        fetchAllItems();
    }, []);

    const handleScroll = () => {
        const el = scrollRef.current;
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 5 && hasMore) {
            loadMoreItems();
        }
    };

    const loadMoreItems = () => {
        const currentLength = visibleItems.length;
        const nextItems = filteredItems.slice(currentLength, currentLength + PAGE_SIZE);

        if (nextItems.length > 0) {
            setTimeout(() => {
                setVisibleItems((prev) => [...prev, ...nextItems]);
            }, 3000); // Simulate a 3-second delay
        } else {
            setHasMore(false);
        }
    };

    useEffect(() => {
        const el = scrollRef.current;
        el.addEventListener('scroll', handleScroll);
        return () => el.removeEventListener('scroll', handleScroll);
    }, [hasMore, visibleItems]);

    const filteredItems = allItems.filter((item) =>
        item.mission_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
        <div className="main__wrapper">
            
            <input
                type="search"
                className="search"
                placeholder="Search by mission name..."
                value={searchQuery}
                onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setVisibleItems(filteredItems.slice(0, PAGE_SIZE));
                    setHasMore(true);
                }}
            />

            
            <div
                ref={scrollRef}
                style={{ height: '300px', overflowY: 'scroll', border: '1px solid #ccc' }}
            >
                <div>
                    {visibleItems.map((flightNumber) => (
                        <div key={flightNumber.flight_number}>
                            <FlightDetails {...flightNumber}/>
                        </div>
                    ))}
                    {hasMore && <p>Loading more...</p>}
                    {!hasMore && <p>No more data to load.</p>}
                </div>
            </div>
        </div>
        </div>
    );
};

export default FlightNumberList;