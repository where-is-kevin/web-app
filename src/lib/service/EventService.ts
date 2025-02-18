import axiosInstance from "@/utils/axiosInstance";

export const eventService = {

    async getTrackedEvents() {

        const response = await axiosInstance.get('/api/v2/user/read/tracked/events')

        return response.data.data.rows
    },

    async getLikedEvents() {

        const response = await axiosInstance.get('/api/v2/user/read/liked/events')

        return response.data.data.rows
    },
}