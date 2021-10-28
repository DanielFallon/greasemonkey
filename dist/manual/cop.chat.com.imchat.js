// ==UserScript==
// @name         cammedia open IM window
// @namespace    http://cop.chat.com/
// @version      1.0
// @description  open cammedia im window from profile on a separate tab
// @author       You
// @match        https://www2.cammedia.com/*/chat.html*
// @match        https://www2.cammedia.com/1/*/profile/*
// @grant        none
// ==/UserScript==


// libarary functions
function waitFor(checkFn, checkFrequencyMs, timeoutMs) {
    const startTimeMs = Date.now();
    return new Promise((res,rej)=>{
        const f = ()=>{
            const v = checkFn()
            console.log("Checked a value:",v)
            if(v !== undefined){
                return res(v);
            }
            if(timeoutMs && Date.now() - startTimeMs > timeoutMs) {
                return rej(new Error("Timeout exceeded"))
            }
            setTimeout(f, checkFrequencyMs)
        }
        setTimeout(f,0)
    })
}


// running on profile pages
// see them by going to: https://www2.cammedia.com/1/chat/members/my_account.php
(async function() {
    'use strict';
    const re = /^https:\/\/www2.cammedia.com\/1\/[^/]*\/profile\/.*/
    if(!re.test(window.location.toString())) return;
    // initialize if it doesn't exist
    window.IMChat = window.IMChat || {};

    const channel = new BroadcastChannel('chat-app');

    // document.getElementById("btn_sendIM")
    //     .addEventListener('click',(ev)=>{
    //         channel.postMessage(["popCon",[window.user, ev.target.getAttribute("data-imhost")]]);

    // })

    window.IMChat.popCon = window.IMChat.popCon || ((r, e, t) => {
        channel.postMessage(["popCon",[r, e, t]]);

    });

})();


// running against chat app
(async function() {
    'use strict';
    const re = /^https:\/\/www2.cammedia.com\/[^/]*\/chat.html.*/
    if(!re.test(window.location.toString())) return;
    // initialize if it doesn't exist
    if(!window.IMChat) window.IMChat = {}
    const channel = new BroadcastChannel('chat-app');


    await waitFor(()=>window.IMChat, 100, 120000)

    channel.addEventListener ('message', (event) => {
        console.log(event.data);
        if(event.data[0] === "popCon"){
            window.IMChat.popCon.apply(window.IMChat, event.data[1])
        }
    });

})();
