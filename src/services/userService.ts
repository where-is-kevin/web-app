import axiosInstance from "@/utils/axiosInstance";

export const userService = {

    async getProfileImage() {
        const response = await axiosInstance.get('/api/v2/user/picture/read')

        return response.data.base64_image
    },
}