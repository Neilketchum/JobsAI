import axios from 'axios';

export const fetchDocuments = async (email) => {
    try {
        console.log('email', email);
        const response = await axios.get(`http://localhost:8080/files/${email}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching documents:', error);
        throw error;
    }
};

export const deleteDocument = async (fileUrl, email) => {
    try {
        const response = await axios.delete('http://localhost:8080/files/delete', {
            data: { fileUrl, emailId: email }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting file:', error);
        throw error;
    }
};
