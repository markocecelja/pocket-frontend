import Cookies from 'universal-cookie';
import axios from 'axios';
import { Environments } from "../enums/Environment";

const getHeader = () => {

    const cookies = new Cookies();
    const jwt = cookies.get("jwt");

    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
    }
}

export const performRequest = async (path, method, body) => {

    const response = await axios({
        method: method,
        url: `${Environments.LOCAL}${path}`,
        data: body,
        headers: getHeader()
      });

    return response.data;
}