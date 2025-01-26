const mongoose = require('mongoose');

const userAnalyticsSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    totalResumeAnalyzed: {
        type: Number,
        default: 0
    },
    totalCoverLetterGenerated: {
        type: Number,
        default: 0
    },
    chartMapper: {
        type: Map,
        of: new mongoose.Schema({
            totalResumesAnalyzed: {
                type: Number,
                default: 0
            },
            totalCoverLetterGenerated: {
                type: Number,
                default: 0
            }
        })
    }
});

module.exports = mongoose.model('UserAnalytics', userAnalyticsSchema);
