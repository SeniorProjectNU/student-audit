import axios from 'axios'
axios.defaults.baseURL = 'http://178.62.206.207:8080';

export function post(_this, url, payload, successCallback, errorCallback, headers = '') {

    return axios({
        method: 'POST',
        url: url,
        data: payload,
        headers: headers
    }).then(response => {
        successCallback( response );
    }).catch(error => {
        if(!error.status)
            console.log('network error');
        console.log(error.response);
        if(errorCallback)
            errorCallback( error );
    });
}

export function get(_this, url, payload, successCallback, errorCallback) {
    let headers = '';

    return axios({
        method: 'GET',
        url: url,
        params: payload.params,
        headers: headers
    }).then(response => {
        successCallback( response );
    }).catch(error => {
        if(errorCallback)
            errorCallback( error );
    });
}


export function del(_this, url, payload, successCallback, errorCallback) {
    let headers = _this.$auth.getToken() ? {'Authorization': `Bearer ${_this.$auth.getToken()}`} : '';

    return axios({
        method: 'DELETE',
        url: url,
        headers: headers
    }).then(response => {
        successCallback( response );
    }).catch(error => {
        if(errorCallback)
            errorCallback( error );
    });


}