const axios = require("axios");

const sendSMS = async ({ to, text, from = "Q-Zat Pesa" }) => {
    const isProduction = process.env.NODE_ENV === 'production';
    const url = isProduction 
      ? "https://messaging-service.co.tz/api/sms/v1/text/single"
      : "https://messaging-service.co.tz/api/sms/v1/test/text/single";

    const payload = {
        from,
        to,
        text,
        reference: `ref_${Date.now()}` // required by API
    };

    try {
        const response = await axios.post(url, payload, {
            headers: {
                "Authorization": "Basic US16YXQ6ZWxhbWVqYTFAZ21haWwuY29t",
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
        });

        return {
            success: true,
            status: response.status,
            data: response.data,
        };
    } catch (err) {
        return {
            success: false,
            error: err.response?.data || err.message,
        };
    }
};

module.exports = sendSMS;
