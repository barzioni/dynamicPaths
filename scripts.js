let urls = {};

getUrls();

function getUrls() {
    chrome.storage.sync.get('urls', function (item) {
        if (!chrome.runtime.error) {
            log(item);
            if (item.urls === '') {
                log('no urls...');
                return
            }
            urls = item.urls;
            renderUrls();
            log(urls)
        }
    });
}

function saveUrls() {
    chrome.storage.sync.set({urls: urls});
}


function goto(e) {
    var str = e.target.dataset.url
    for (var i = 0; i < str.length; i++) {
        if (str[i] === '*') {
            var variable = prompt("Variable " + i);
            if (variable == null || variable == "") {
                alert('Variables not set for url');
                return;
            }
            str = str.replaceAt(i, variable)
        }
    }
    chrome.tabs.create({url: str});
};

function removeItem(e) {

    delete urls[e.target.dataset.key];
    saveUrls();
    getUrls();
}

document.getElementById("form").onsubmit = function (e) {

    const url = e.target[0].value;
    if (!url) {
        alert('No url has entered!');
        return;
    }

    var name = prompt("Name of url:", "Sandbox wp-admin");
    if (name == null || name == "") {
        alert('Every url need a name...');
        return;
    }

    urls[name] = url;

    saveUrls();
    renderUrls()
};

function renderUrls() {
    const el = document.getElementById("data");
    log('clear')
    el.innerHTML = '';

    for (let i in urls) {

        const wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'wrapper');

        const url = document.createElement('a');
        url.addEventListener('click', goto);
        url.dataset['url'] = urls[i];
        url.setAttribute('href', '#');
        url.setAttribute('class', 'goto');
        url.appendChild(document.createTextNode(urls[i]));

        const remove = document.createElement('button');
        remove.addEventListener('click', removeItem);
        remove.setAttribute('type', 'button');
        remove.setAttribute('title', 'Remove');
        remove.setAttribute('data-key', i);
        remove.appendChild(document.createTextNode("X"));

        const label = document.createElement('span');
        label.setAttribute('class', 'label');
        label.appendChild(document.createTextNode(i));


        wrapper.appendChild(label);
        wrapper.appendChild(url);
        wrapper.appendChild(remove);



        el.appendChild(wrapper);
    }
}

function log(param) {
    chrome.extension.getBackgroundPage().console.log(param);
}

document.getElementById("clear-all").onclick = function () {
    chrome.storage.sync.set({urls: ''}, function () {
        log('All clear!');
    });
};


String.prototype.replaceAt = function (index, replacement) {
    return this.substr(0, index) + encodeURI(replacement) + this.substr(index + 1);
};
