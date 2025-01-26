const UserActivity = require('../models/userActivityModel');
const { faker } = require('@faker-js/faker');

async function getUserAnalyticsByEmail(email) {
    try {
        const userActivity = await UserActivity.findOne({ email });
        const response = {
            userActivity: userActivity
        };
        return response;
    } catch (error) {
        console.error('Error fetching user analytics:', error);
        throw error;
    }
}

async function seedUserActivityData(email) {
    try {
        const userActivity = await UserActivity.findOne({ email });
        const currentDate = new Date();

        const loginTimestamps = Array.from({ length: 30 }, (_, i) => {
            const randomDate = new Date(currentDate);
            randomDate.setDate(currentDate.getDate() - i);
            randomDate.setHours(Math.floor(Math.random() * 24));
            randomDate.setMinutes(Math.floor(Math.random() * 60));
            return randomDate;
        });

        const chartMapper = new Map();

        for (let i = 0; i < 30; i++) {
            const day = new Date(currentDate);
            day.setDate(currentDate.getDate() - i);
            const dateKey = day.toISOString().split('T')[0];

            const totalResumesAnalyzed = Math.floor(Math.random() * 6);
            const totalCoverLetterGenerated = Math.floor(Math.random() * 6);

            chartMapper.set(dateKey, {
                totalResumesAnalyzed,
                totalCoverLetterGenerated
            });
        }

        const resumesAnalyzed = Array.from({ length: 30 }, (_, i) => {
            const day = new Date(currentDate);
            day.setDate(currentDate.getDate() - i);
            return Array.from({ length: Math.floor(Math.random() * 6) }, () => ({
                timestamp: new Date(day),
                jobDescription: faker.lorem.sentence()
            }));
        }).flat();

        const coverLettersGenerated = Array.from({ length: 30 }, (_, i) => {
            const day = new Date(currentDate);
            day.setDate(currentDate.getDate() - i);
            return Array.from({ length: Math.floor(Math.random() * 6) }, () => ({
                timestamp: new Date(day),
                companyName: faker.company.name(),
                jobDescription: faker.lorem.sentence()
            }));
        }).flat();

        if (userActivity) {
            userActivity.loginTimestamps = loginTimestamps;
            userActivity.resumesAnalyzed = resumesAnalyzed;
            userActivity.coverLettersGenerated = coverLettersGenerated;
            userActivity.totalResumeAnalyzed = Array.from(chartMapper.values()).reduce((sum, day) => sum + day.totalResumesAnalyzed, 0);
            userActivity.totalCoverLetterGenerated = Array.from(chartMapper.values()).reduce((sum, day) => sum + day.totalCoverLetterGenerated, 0);
            userActivity.chartMapper = chartMapper;
            await userActivity.save();
        } else {
            await UserActivity.create({
                email,
                loginTimestamps,
                resumesAnalyzed,
                coverLettersGenerated,
                totalResumeAnalyzed: Array.from(chartMapper.values()).reduce((sum, day) => sum + day.totalResumesAnalyzed, 0),
                totalCoverLetterGenerated: Array.from(chartMapper.values()).reduce((sum, day) => sum + day.totalCoverLetterGenerated, 0),
                chartMapper
            });
        }

        console.log('Seed data inserted/updated for user:', email);
    } catch (error) {
        console.error('Error seeding data:', error);
        throw error;
    }
}

module.exports = {
    getUserAnalyticsByEmail,
    seedUserActivityData
};