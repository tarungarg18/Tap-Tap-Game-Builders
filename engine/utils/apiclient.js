class APIClient {
    static async submitScore(data) {
        try {
            console.log("\n Submitting Score...");
            console.log(data);

            await new Promise(res => setTimeout(res, 500));

            console.log(" Score Submitted!");

        } catch (err) {
            console.error("[API ERROR]", err.message);
        }
    }
}

module.exports = APIClient;