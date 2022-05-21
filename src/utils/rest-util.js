import Cookies from 'universal-cookie';
import axios from 'axios';
import { Environments } from "../enums/Environment";
import toast from 'react-hot-toast';
import { getErrorByCode } from '../enums/Error';

const getHeader = (isPublic) => {

    const cookies = new Cookies();
    const jwt = cookies.get("jwt");

    if (!jwt) {
        return isPublic ? {
            'Content-Type': 'application/json'
        } : null;
    }

    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
    };
}

export const performRequest = async (path, method, body) => {

    const header = getHeader(path.includes("public"));

    if (!header) {
        return null;
    }

    const response = await axios({
        method: method,
        url: `${Environments.LOCAL}${path}`,
        data: body,
        headers: getHeader()
    }).catch(function () {
        return null;
    });

    if (response && response.data.status === "ERROR") {
        toast.error(getErrorByCode(response.data.errorCode));
        return null;
    }

    return response ? response.data : null;
}