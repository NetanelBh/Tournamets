const WhatsAppButton = ({ message }) => {
  const share = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <button onClick={share} style={{ border: "none", background: "none" }}>
      <img
        src="https://cdn-icons-png.flaticon.com/512/124/124034.png"
        alt="WhatsApp"
        style={{ width: 40, cursor: "pointer", borderRadius: "50%" }}
      />
    </button>
  );
};

export default WhatsAppButton;
