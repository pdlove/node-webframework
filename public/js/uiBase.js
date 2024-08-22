var controlSource = {};
const apiBase = location.protocol + '//' + location.host+'/api/';
function loadControlSource(controlName) {

}

var panelSource = {};
function loadPanelSource(panelName) {

}

function loadPanel(panelName, dstContainer, parameters) {

}

async function loadAPIData(endpoint) {
    const url = `${window.location.protocol}//${window.location.host}/api/${endpoint}`;
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

async function loadControl(controlName, destTag, parameters) {
    const url = `${window.location.protocol}//${window.location.host}/api/ui/web/control/${controlName}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        if (json.cssCode) {
            let cssArea = document.getElementById(`css_${controlName}`);
            if (!cssArea) {
                //Create new tag
                cssArea = document.createElement("style");
                cssArea.id=`css_${controlName}`;
                cssArea.innerHTML=json.cssCode;
                document.getElementsByTagName("head")[0].appendChild(cssArea);
            } else {
                if (cssArea.innerHTML!==json.cssCode) {
                    alert("CSS different for this control.");
                }
            }
        }
        if (json.jsCode) {
            let jsArea = document.getElementById(`js_${controlName}`);
            if (!jsArea) {
                //Create new tag
                jsArea = document.createElement("script");
                jsArea.id=`js_${controlName}`;
                jsArea.innerHTML=json.jsCode;
                document.getElementsByTagName("head")[0].appendChild(jsArea);                
            } else {
                if (jsArea.innerHTML!==json.jsCode) {
                    alert("JS different for this control.");
                }
            }
        }
        
        if (json.htmlCode) {
            destTag.innerHTML=json.htmlCode
        } else {
            destTag.innerHTML='';
        }

        const newControl = eval(`new ${controlName}()`);
        newControl.setParameters(parameters);
        newControl.renderDOM(destTag);
        return newControl
    } catch (error) {
        console.error(error.message);
    }
}
