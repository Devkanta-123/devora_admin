import OrderTracking from "./OrderTracking";

// Legacy route alias for /track ensuring backward compatibility
const Track = () => {
  return <OrderTracking />;
};

export default Track;
