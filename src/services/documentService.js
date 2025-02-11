import axios from 'axios';

export const fetchDocuments = async (email) => {
    try {
        console.log('email', email);
        const response = await axios.get(`https://jobsai-446602.wm.r.appspot.com/files/${email}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching documents:', error);
        throw error;
    }
};

export const deleteDocument = async (fileUrl, email) => {
    try {
        const response = await axios.delete('https://jobsai-446602.wm.r.appspot.com/files/delete', {
            data: { fileUrl, emailId: email }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting file:', error);
        throw error;
    }
};
