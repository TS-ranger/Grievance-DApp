export default function Ticker() {
  const items = [
    "Ensures transparent and tamper-proof grievance tracking",
    "Improves accountability with real-time complaint monitoring",
    "Reduces corruption through decentralized secure workflows",
  ];

  return (
    <div className="ticker-container">
      <div className="ticker-track">
        {/* We output the elements twice or triple times to create a seamless infinite loop */}
        {[...Array(3)].map((_, groupIndex) => (
          <div key={groupIndex} className="ticker-group">
            {items.map((item, index) => (
              <div key={`${groupIndex}-${index}`} className="ticker-item">
            
                {item}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
