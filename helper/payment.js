const axios = require('axios');

const qzatPushPayment = async ({ channel, phone_number, amount, fname, lname, payment_id }) => {
    const payload = {
        channel,        // e.g., "Tigo", "Airtel", "Mpesa"
        msisdn: phone_number, // full phone number (e.g., 2557XXXXXXXX)
        amount,
        id: payment_id, // your internal transaction ID
        app_id: "1",
        fname,
        lname,
    };

    try {
        const response = await axios.post("https://payments.q-zat.com/api/v1/payments", payload, {
            headers: {
                'AppToken': '48155d1312c0a11ca107',
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data || error.message
        };
    }
};

module.exports = qzatPushPayment;
