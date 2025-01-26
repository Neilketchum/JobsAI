const AnalyticsService = require('../services/AnalyticsService');

async function runSeeder(req, res) {
    const { email } = req.body;
    try {
        await AnalyticsService.seedUserActivityData(email);
        res.status(200).send('Seeder ran successfully');
    } catch (error) {
        console.error('Error running seeder:', error);
        res.status(500).send('Error running seeder');
    }
}

async function getAnalytics(req, res) {
    const { email } = req.params;
    try {
        const analyticsData = await AnalyticsService.getUserAnalyticsByEmail(email);
        res.status(200).json(analyticsData);
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).send('Error fetching analytics');
    }
}

module.exports = {
    runSeeder,
    getAnalytics
};
