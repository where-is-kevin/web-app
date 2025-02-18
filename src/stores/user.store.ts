import {create} from "zustand";
import {devtools, persist} from 'zustand/middleware'
import axiosInstance from "@/utils/axiosInstance";

interface UserState {
    firstName: string
    lastName: string
    mail: string
    image: string
    fetchInformation: () => Promise<void>;
    reset: () => void
    setAbout: (about: string) => void
    loading: boolean
    home: string
    about: string
    travelDestination?: string
}


const useUserStore = create<UserState>()(
    devtools(
        persist(
            (set, get) => ({
                firstName: '',
                lastName: '',
                mail: '',
                home: '',
                image: '',
                travelDestination: '',
                about: '',
                loading: false,
                setAbout: (about: string) => {
                    set({
                        about: about
                    })
                },
                fetchInformation: async () => {
                    if (get().mail.length === 0) {
                        set({loading: true});
                        try {
                            const response = await axiosInstance.get("/api/v2/user/information");
                            set({
                                firstName: response.data.firstName,
                                loading: false,
                                lastName: response.data.lastName,
                                image: response.data.image,
                                home: response.data.home,
                                about: response.data.about,
                                travelDestination: response.data.travelDestination,
                            });
                        } catch (error) {
                            console.error(error);
                            set({loading: false});
                        }
                    }
                    set({loading: false});
                },
                reset: () => {
                    set(() => ({
                        firstName: '',
                        lastName: '',
                        mail: '',
                        image: '',
                        home: '',
                        about: '',
                        travelDestination: '',
                        loading: false,
                    }))
                },

            }),
            {
                name: 'user-storage'
            }
        )
    )
)

export default useUserStore