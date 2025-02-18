import axiosInstance from "@/utils/axiosInstance";

export const UserService = {

    async readTagScores() {
        const response = await axiosInstance.get('/api/v2/user/read/tag/scores')

        return response.data.data.rows
    },
}