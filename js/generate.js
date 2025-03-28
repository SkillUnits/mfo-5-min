
    function makeid233(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }

    let source = document.currentScript.getAttribute('source');
    let jsCode = makeid233(16);
    const tid = Math.floor(Math.random() * 1000000000);
    let frameLinks = [
                    'https://swco.cc/fp/frame',
            ];

    let frameIndex = 0;

    var fpData = {};

    function addFrame () {
        let ifrm = document.createElement("iframe");
        ifrm.setAttribute("src", frameLinks[frameIndex] + "?source=" + source + '&js_code=' + jsCode + (frameIndex === frameLinks.length - 1 || frameIndex === 0 ? '&return=1' : ''));
        ifrm.setAttribute("id", "frame-f-" + frameIndex);
        ifrm.style.display = 'none';
        document.body.appendChild(ifrm);

        frameIndex++;

        if (frameLinks[frameIndex]) {
            document.querySelector("#frame-f-" + (frameIndex - 1)).addEventListener("load", function (event) {
                if (frameIndex === 1) {
                    document.getElementById("frame-f-" + (frameIndex - 1)).contentWindow.postMessage('', '*');
                }
                addFrame();
            });

            if (frameIndex === 1) {
                window.onmessage = function (event) {
                    console.log(event.data);
                    if (event.data.uniq_code) {
                        console.log(event.data.uniq_code);
                        fpData = event.data;

                        if (eval("typeof(prehandleFp) === typeof(Function)")) {
                            prehandleFp(fpData);
                        }
                    }
                }
            }
        } else {
            document.querySelector("#frame-f-" + (frameIndex - 1)).addEventListener("load", function (event) {
                document.getElementById("frame-f-" + (frameIndex - 1)).contentWindow.postMessage('', '*');
            });

            window.onmessage = function (event) {
                console.log(event.data);
                if (event.data.uniq_code) {
                    console.log(event.data.uniq_code);
                    fpData = event.data;

                    if (frameIndex === 1) {
                        if (eval("typeof(prehandleFp) === typeof(Function)")) {
                            prehandleFp(fpData);
                        }
                    }

                    if (eval("typeof(handleFp) === typeof(Function)")) {
                        handleFp(fpData);
                    }
                }
            }
        }
    }