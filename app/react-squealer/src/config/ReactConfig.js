const ReactConfig = {
    //DEBUG
    base_url_requests : 'http://localhost:8000',
    base_url_navigation : '',

    //PRODUCTION
    //base_url_requests: '',
    //base_url_navigation: '/userView',

    pathFunction: function (path) {
        if (path.charAt(0) !== '/')
            path = '/' + path;
        return ReactConfig.base_url_navigation + path;
    }
};

export default ReactConfig;

//IDEA: On debug sessions we can send requests to our express process. If we are in produciont we send the requests (omitting host and port) at same port!
//BEFORE COMPILE PROCESS UNCOMMENT BASE URL = '' AND COMMENT THE OTHER ONE!
