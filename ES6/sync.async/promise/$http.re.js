export default class $http {
    // Method that performs the ajax request
    static iAjax(method = 'POST', url, args, conf = {}) {
        // Creating a promise
        const promise = new Promise((resolve, reject) => {
            // Instantiates the XMLHttpRequest
            const client = new XMLHttpRequest();
            let uri = url;
            if (args && (method === 'POST' || method === 'PUT')) {
                uri += '?';
                let argcount = 0;
                Object.keys(args).forEach((key) => {
                    argcount += 1 && (uri += '&');
                    uri += encodeURIComponent && encodeURIComponent(key) + '=' + encodeURIComponent(args[key]);
                });
            }
            client.open(method, uri, conf);
            client.send();

            client.onload = function onload() {
                if (this.status >= 200 && this.status < 300) {
                    // Performs the function "resolve" when this.status is equal to 2xx
                    return resolve(this.response);
                }
                // Performs the function "reject" when this.status is different than 2xx
                return reject(this.statusText);
            };
            client.onerror = function onerror() {
                reject(this.statusText);
            };
        });

        return promise;
    }

    static iGet(url, args, conf) {
        return $http.iAjax('GET', url, args, conf);
    }

    static iPost(url, args, conf) {
        return $http.iAjax('POST', url, args, conf);
    }

    static iDelate(url, args, conf) {
        return $http.iAjax('DELETE', url, args, conf);
    }
}
