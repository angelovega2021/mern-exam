import { useState } from 'react'

const FlightDetails = ({mission_name, details}) => {
    
    const [showDetails, setShowDetails] = useState(false);
    
    return (
        <div className="launch__item">
            <h3>{mission_name}</h3>
            <button
                onClick={() => setShowDetails((prev) => !prev)}
                className="btn"
            >
                {showDetails ? 'Hide Details' : 'Show Details'}
            </button>
            {showDetails && (
                <div className="launch__details">
                    <p>{details}</p>
                </div>
            )}
        </div>
    );
}
export default FlightDetails