import axios from "axios";

export const login = async (login) => {
    try {
        // debugger;
        const res = await axios.post("/api/auth/sign-in", login);
        if (res.status === 200) {
            localStorage.setItem("token", res.data.token);
            const roles = res.data.roles.map((item) => item.authority);
            localStorage.setItem("roles", roles);

            // localStorage.setItem("username", res.data.userName);

            console.log(localStorage.getItem("roles"))
            return res.data;
        }
    } catch (e) {
        throw e;
    }
};

