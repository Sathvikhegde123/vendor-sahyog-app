import api from "../utils/api";

export const generateKRI = async (payload) => {
    const { data } = await api.post("/kri", payload);
    return data;
};