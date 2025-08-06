import React from "react";

const FreeShippingProgress = ({ subtotal, threshold = 2500 }) => {
  const remaining = Math.max(0, threshold - subtotal);
  const percentage = Math.min(100, Math.round((subtotal / threshold) * 100));

  return (
    <div style={{ marginTop: "20px", textAlign: "center" }}>
      <div
        style={{
          height: "10px",
          borderRadius: "4px",
          background: "#eee",
          overflow: "hidden",
          marginBottom: "8px",
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            background: "#28a745",
          }}
        />
      </div>

      {subtotal < threshold ? (
        <div style={{ fontSize: 13 }}>
          Spend <strong>₹{remaining.toLocaleString()}</strong> more to get{" "}
          <strong>free shipping</strong>
        </div>
      ) : (
        <div style={{ fontSize: 13, color: "#28a745", fontWeight: 600 }}>
          🎉 You’ve unlocked free shipping!
        </div>
      )}
    </div>
  );
};

export default FreeShippingProgress;
