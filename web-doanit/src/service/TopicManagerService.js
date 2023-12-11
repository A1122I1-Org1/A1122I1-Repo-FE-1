
const API_BASE_URL = '/api/public/topic-manager';

const TopicManagerService = {
    fetchTopics: async (page = 0, size = 20) => {
        try {
            const response = await fetch(`${API_BASE_URL}/topic?page=${page}&size=${size}`);

            if (!response.ok) {
                throw new Error('Failed to fetch topics');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching topics:', error.message);
            throw error;
        }
    },

    searchTopics: async (name = '', page = 0, size = 20) => {
        try {
            const response = await fetch(`${API_BASE_URL}/topic-search?name=${name}&page=${page}&size=${size}`);

            if (!response.ok) {
                throw new Error('Failed to search topics');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error searching topics:', error.message);
            throw error;
        }
    },

    findTopicById: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/findById/${id}`);

            if (!response.ok) {
                throw new Error('Failed to find topic by ID');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error finding topic by ID:', error.message);
            throw error;
        }
    },
};

export default TopicManagerService;
