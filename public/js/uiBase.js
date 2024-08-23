var controlSource = {};
var panelSource = {};
var loadedClientControls = {};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function loadControlSource(controlName) {

}

function loadPanelSource(panelName) {

}

function loadPanel(panelName, dstContainer, parameters) {

}
class prgAPI {
    token = null;
    apiBase = location.protocol + '//' + location.host + '/api/';

    async getAPIData(endpoint) {
        const url = `${this.apiBase}${endpoint}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const json = await response.json();
            console.log(json);
            return json;
        } catch (error) {
            console.error(error.message);
        }
    }

    getAPIURLwithToken(endpoint, version) {
        let url = `${this.apiBase}${endpoint}`;
        if (!version) version = 1;
        if (this.token) {        
            url = `${url}?token=${this.token}&version=${version}`
        } else {
            url = `${url}?version=${version}`
        }
        return url;
    }
}
var API = new prgAPI();

async function fetchClientControl(controlName) {
    if (loadedClientControls[controlName]) return;
    const apiEndpoint = `ui/web/control/${controlName}`;
    let thisControl = {}
    let controlData = null;
    //Get the control Data from the endpoint
    try {
        controlData = await API.getAPIData(apiEndpoint);
    } catch (error) {
        console.error(`Error fetching control data for ${controlName}: ${error.message}`);
    }

    //Setup the CSS link if needed
    try {
        if (controlData.cssCode) {
            //Create new tag
            thisControl.cssArea = document.createElement("link");
            thisControl.cssArea.rel="stylesheet";
            thisControl.cssArea.href= API.getAPIURLwithToken(`ui/web/control/${controlName}.css`);
            document.getElementsByTagName("head")[0].appendChild(thisControl.cssArea);
        }
    } catch (error) {
        console.error(`Error loading CSS for ${controlName}: ${error.message}`);
    }

    //Setup the Javascript if needed
    try {
        if (controlData.jsCode) {
            //Create new tag
            thisControl.jsArea = document.createElement("script");
            thisControl.jsArea.status = "not loaded";
            thisControl.jsArea.src = API.getAPIURLwithToken(`ui/web/control/${controlName}.js`);
            // Add event listener for when the script is loaded
            thisControl.jsArea.onload = () => {
                console.log(`Script loaded for ${controlName}`);
                thisControl.jsArea.status = "loaded";
            };

            // Add event listener for error handling
            thisControl.jsArea.onerror = () => {
                console.error(`Error loading script: ${url}`);
                thisControl.jsArea.status = "error";
            };           
                        
            document.getElementsByTagName("head")[0].appendChild(thisControl.jsArea);
        }
    } catch (error) {
        console.error(`Error loading Javascript for ${controlName}: ${error.message}`);
    }

    thisControl.htmlCode = controlData.htmlCode

    if (thisControl.jsArea) {
        while (thisControl.jsArea.status == "not loaded") {
            await sleep(10);
        }
    }
    loadedClientControls[controlName] = thisControl;
    for (let idx in controlData.requiredControls) {
        await fetchClientControl(controlData.requiredControls[idx]);
    }
}

async function loadClientControl(controlName, destTag, parameters) {
    await fetchClientControl(controlName);
    try {
        if (loadedClientControls[controlName].htmlCode) {
            destTag.innerHTML = loadedClientControls[controlName].htmlCode;
        } else {
            destTag.innerHTML = '';
        }

        const newControl = eval(`new ${controlName}()`);
        await newControl.setParameters(parameters);
        await newControl.renderDOM(destTag);
        return newControl
    } catch (error) {
        console.error(error.message);
    }
}
