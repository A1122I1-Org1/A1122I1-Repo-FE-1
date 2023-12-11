// notificationService.js
import axios from 'axios';

// const BASE_URL = 'http://localhost:8080'; // Thay đổi đường dẫn dựa trên API của bạn

const NotificationService = {
    getListNotification: async (page = 0, pageSize = 5) => {
        try {
            const response = await axios.get(`/notification/3?page=${page}&size=${pageSize}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching notifications:', error);
            return { error: 'Failed to fetch notifications.' }; // Trả về đối tượng chứa thông điệp lỗi
        }
    },

    seenNotification: async (id, page = 0, pageSize = 5) => {
        try {
            const response = await axios.get(`/seen-notification/${id}?page=${page}&size=${pageSize}`);
            return response.data;
        } catch (error) {
            console.error('Error marking notifications as seen:', error);
            return { error: 'Failed to mark notifications as seen.' }; // Trả về đối tượng chứa thông điệp lỗi
        }
    },
};

export default NotificationService;
