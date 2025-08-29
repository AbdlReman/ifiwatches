const WhatsAppButton = () => {
    const handleWhatsAppClick = () => {
        const phoneNumber = "+923285315636";
        const message = "Hello! I'm interested in your products.";
        const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <button
            aria-label="Contact us on WhatsApp"
            type="button"
            className="whatsapp-button"
            id="whatsapp-float-button"
            onClick={handleWhatsAppClick}
            style={{
                position: 'fixed',
                bottom: '40px',
                right: '20px',
                width: 'auto',
                height: 'auto',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                zIndex: 1000,
                padding: '0',
                margin: '0',
                transition: 'all 0.3s ease',
                outline: 'none',
                boxShadow: 'none',
                borderRadius: '0',
                backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
            }}
        >
            <img 
                src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
                alt="WhatsApp"
                style={{ 
                    width: '60px',
                    height: '60px',
                    filter: 'drop-shadow(0 4px 8px rgba(37, 211, 102, 0.3))'
                }}
            />
        </button>
    );
};

export default WhatsAppButton;