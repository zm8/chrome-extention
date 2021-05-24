const TAB_STATUS_1 = '__TAB_STATUS_1';
const TAB_STATUS_2 = '__TAB_STATUS_2';

function injectScript(jsStr){
    const el = document.createElement("script");
    el.innerHTML = jsStr;
    document.head.appendChild(el);
}

let $div;
let timeoutDiv;
// 添加 页面提示
function showTip(str){
    if(!$div){
        $div = document.createElement("div");
        addClass($div, '__plugin-jump-cnt');
        document.body.appendChild($div);
    }
    $div.innerHTML = str;

    removeClass($div, 'hide');
    clearTimeout(timeoutDiv);
    timeoutDiv = setTimeout(()=>{
        addClass($div, 'hide');
    }, 1000);
}

function syncSet(obj={}){
    return new Promise(resolve=>{
        chrome.storage.sync.set(obj, ()=>{
            resolve();
        });
    });
}

function syncGet(str=''){
    return new Promise(resolve=>{
        chrome.storage.sync.get(str, result=>{
            resolve(result[str]);
        });
    });
}

function addClass($el, className){
    let list = [...$el.classList];
    list.push(className);
    $el.className = list.join(' ');
    return $el;
}

function removeClass($el, className){
    let list = [...$el.classList];
    list = list.filter(item => item !== className);
    $el.className = list.join(' ');
    return $el;
}


function addListenerDebug(){
    const str = `
        window._extendtion_debugFunc = ()=> { debugger; };
        window.addEventListener('beforeunload', window._extendtion_debugFunc);
    `;
    injectScript(str);
}


function removeListenerDebug(){
    const str = `
        window.removeEventListener('beforeunload', window._extendtion_debugFunc);
    `;
    injectScript(str);
}




function addListenerStop(){
    const str = `
        window._extendtion_stopFunc = function(e){
            // 这里 Chrome 浏览器禁止直接弹层, 所以必须触发用户点击操作
            e.preventDefault();
            e.returnValue = 'Stop the page redirection by Stop-Jump Plugin';
        }
        
        window._extendtion_stopClickFunc = ()=>{
            console.error('Already trigger stop-jump extention.');
            window.addEventListener('beforeunload', window._extendtion_stopFunc);
        }
        document.addEventListener('click', window._extendtion_stopClickFunc);
    `;
    injectScript(str);
}

function removeListenerStop(){
    const str = `
        document.removeEventListener('click', window._extendtion_stopClickFunc);
        window.removeEventListener('beforeunload', window._extendtion_stopFunc);
    `;
    injectScript(str);
}

function showTipRunning(){
    showTip("Stop-Jump is running");
}