var hash = window.location.hash.substring(1);
function startstopwatch(intmslapsed) {
    var fiveSeconds = new Date().getTime() - intmslapsed;
    $('#clock').countdown(fiveSeconds, { elapse: true }).on('update.countdown', function (event) {
        var $this = $(this);
        if (event.elapsed) {
            $this.html(event.strftime('<i class="fa fa-spin fa-spinner mr-1"></i><span class="text-dark">%D days %H hr %M min %S secs ago </span>'));
        } else { $this.html(event.strftime('<span>%D days %H:%M:%S</span>')); }
    });
}
function funcOnclick(newType, elemid) {
    if (newType == 'Text') {
        document.getElementById('chunk_' + elemid).innerHTML = hex2asc(document.getElementById('chunk_ori_' + elemid).innerHTML);
    } else if (newType == 'Num') {
        document.getElementById('chunk_' + elemid).innerHTML = hex2dec(document.getElementById('chunk_ori_' + elemid).innerHTML);
    } else if (newType == 'Addr') {
        document.getElementById('chunk_' + elemid).innerHTML = hex2addr(document.getElementById('chunk_ori_' + elemid).innerHTML);
    } else if (newType == 'Hex') {
        document.getElementById('chunk_' + elemid).innerHTML = document.getElementById('chunk_ori_' + elemid).innerHTML;
    }
    document.getElementById('convert_button_' + elemid).innerHTML = newType;
}
var gotNoteChange = true;
$(document).ready(function () {
    $('#txtPrivateNoteArea').change(function (event) {
        if (gotNoteChange == true) {
            updateNote();
        };
        gotNoteChange = true;
    });
    if (hash != '') {
        activaTab(hash);
    }
    if (hash == 'rawtab') {
        updatehash('');
    } else if (hash == 'decodetab') {
        decodeInput();
        $('.decodetab').trigger('click');
    };
    $('img').error(function () {
        $(this).attr('src', '/assets/img/main/img1.jpg');
        $(this).attr('style', 'height:60px');
    });
});
$('#txtPrivateNoteArea').keypress(function (event) {
    if (event.keyCode == 13) {
        event.preventDefault(); updateNote(); gotNoteChange = false;
    }
});
function updateNote() {
    var txhash = window.location.pathname.substring(4);
    var privnote = document.getElementById("txtPrivateNoteArea").value;
    $.ajax({
        type: 'Get',
        url: '/updateHandler',
        data: { opr: 'updatenotetx', tx: txhash, txt: privnote },
        success: function (res) {
            if (res == 0) {
                $("#privatenotetip").html("<i class='fa fa-check text-success'></i> Your private Note has been successfully updated.");
            } else if (res == 1) {
                $("#privatenotetip").html("<i class='fa fa-exclamation-circle text-secondary'></i> Sorry but to update your private note, You have to be <a href='/login?returntx=" + txhash + "'><b>Logged In</b></a> first.");
            } else if (res == 2) {
                $("#privatenotetip").html("<i class='fa fa-exclamation-triangle text-danger'></i> Unable to update private note. General exception error occurred.");
            } else if (res == 3) {
                $("#privatenotetip").html("<i class='fa fa-exclamation-circle text-secondary'></i> The private note was successfully removed.");
            } else if (res == 4) {
                $("#privatenotetip").html("<i class='fa fa-exclamation-triangle text-danger'></i> Unable to remove private note. General exception error occurred.");
            } else if (res == 5) {
                $("#privatenotetip").html("<i class='fa fa-exclamation-triangle text-danger'></i> Sorry, we were unable to add a new private Note. You have exceeded the maximum allowed quota of your account.");
            }
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
};
function activaTab(tab) {
    if (tab.indexOf('internal') >= 0) {
        tab = 'internal';
    }
    else if (tab.indexOf('overview') >= 0) {
        tab = 'overview';
    } else if (tab.indexOf('comment') >= 0) {
        tab = 'comments'; loaddisqus();
    } else if (tab.indexOf('statechange') >= 0) {
        tab = 'statechange'; loadStateChangeIframeSource();
    };
    $('.nav_tabs1 a[href="#' + tab + '"]').tab('show');
}
var tmpval;
var currentmode = 'hex';
var orival = "";
if (document.getElementById("inputdata") != null) {
    orival = document.getElementById("inputdata").innerHTML;
}
var rawinput = "";
if (document.getElementById("rawinput") != null) {
    rawinput = document.getElementById("rawinput").innerHTML;
}
function convertstr(strval) {
    if (currentmode == 'hex') {
        if (rawinput != "") {
            tmpval = hex2asc(rawinput);
        } else {
            tmpval = hex2asc(strval);
        }
        document.getElementById('inputdata').innerHTML = tmpval;
        document.getElementById('ContentPlaceHolder1_btnconvert222').innerHTML = 'Switch Back'; currentmode = 'asc';
    } else {
        tmpval = asc2hex(strval);
        document.getElementById('inputdata').innerHTML = orival;
        document.getElementById('ContentPlaceHolder1_btnconvert222').innerHTML = 'Convert To Ascii';
        currentmode = 'hex'
    }
}
function updatehash(strhash) {
    if (strhash == '') {
        history.replaceState("", document.title, window.location.pathname);
    } else {
        var baseUrl = window.location.href.split('#')[0];
        history.replaceState("", document.title, baseUrl + '#' + strhash);
    }
}
function asc2hex(pStr) {
    tempstr = '';
    for (a = 0; a < pStr.length; a = a + 1) {
        tempstr = tempstr + pStr.charCodeAt(a).toString(16);
    }
    return tempstr;
}
function hex2asc(pStr) {
    tempstr = '';
    for (b = 0; b < pStr.length; b = b + 2) {
        tempstr = tempstr + String.fromCharCode(parseInt(pStr.substr(b, 2), 16));
    }
    return tempstr;
}
function hex2dec(pStr) {
    var web3 = new Web3();
    tempstr = new web3.BigNumber(pStr, 16)
    return tempstr.toString();
}
function hex2addr(pStr) {
    tempstr = pStr.substr(pStr.length - 40)
    return "<a href='/address/0x" + tempstr + "'>" + "0x" + tempstr + "</a>";
}
function hexpad(instr) {
    if (instr.length % 2)
        return '0' + instr;
    else
        return instr;
}
var analyticsloaded = false;
function loadanalytics() {
    if (analyticsloaded == false) {
        var dsq = document.createElement('script');
        dsq.type = 'text/javascript';
        dsq.async = true;
        dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
        disqusloaded = true;
    }
    updatehash('comments');
}
var interval;
var loopcounter = 1;
if (startTxPendingCheck) {
    var div = document.getElementById('spinnerwait');
    div.style.display = 'block';
    interval = setTimeout(checkForConfirmedTx, 2000);
    function checkForConfirmedTx() {
        if (loopcounter < 45) {
            $.ajax({
                url: "/api?module=localchk&action=txexist&txhash=" + txHash,
                type: "GET",
                success: function (data) {
                    if (data.result == "True") {
                        window.location.href = "/tx/" + txHash;
                    }
                }, dataType: "json"
            })
            loopcounter = loopcounter + 1;
            interval = setTimeout(checkForConfirmedTx, 20000);
        } else {
            stopInterval();
        }
    }
    function stopInterval() {
        console.log("stopInterval called");
        var div = document.getElementById('spinnerwait');
        div.style.display = 'none'; clearTimeout(interval);
    }
    function startInterval() {
        console.log("startInterval called");
        clearTimeout(interval);
        var div = document.getElementById('spinnerwait');
        div.style.display = 'block';
        interval = setTimeout(checkForConfirmedTx, 5000);
    }
}
var blnIsCurrentPrice = true;
if (document.getElementById("pricebutton") != null) {
    var currentPrice = document.getElementById('pricebutton').innerText;
    $("#pricebutton").click(function () {
        if (blnIsCurrentPrice == true) {
            document.getElementById('pricebutton').innerText = LitOldPrice;
            $('#pricebutton').attr('data-original-title', 'Estimated Value at Time of Txn');
            $('#pricebutton').tooltip('show');
            blnIsCurrentPrice = false;
        } else {
            document.getElementById('pricebutton').innerText = currentPrice;
            $('#pricebutton').attr('data-original-title', 'Current Value');
            $('#pricebutton').tooltip('show');
            blnIsCurrentPrice = true;
        }
    });
}
var blnIsCurrentTxnFee = true;
if (document.getElementById("txfeebutton") != null) {
    var currentTxnFee = document.getElementById('txfeebutton').innerText;
    $("#txfeebutton").click(function () {
        if (blnIsCurrentTxnFee == true) {
            document.getElementById('txfeebutton').innerText = LitOldTxCost;
            $('#txfeebutton').attr('data-original-title', 'Estimated Txn Fee at Time of Txn');
            $('#txfeebutton').tooltip('show');
            blnIsCurrentTxnFee = false;
        } else {
            document.getElementById('txfeebutton').innerText = currentTxnFee;
            $('#txfeebutton').attr('data-original-title', 'Current Txn Fee');
            $('#txfeebutton').tooltip('show');
            blnIsCurrentTxnFee = true;
        }
    });
}
var disqusloaded = false;
function loaddisqus() {
    if (disqusloaded == false) {
        var dsq = document.createElement('script');
        dsq.type = 'text/javascript';
        dsq.async = true;
        dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
        disqusloaded = true;
    }
    updatehash('comments');
}
function Count(text) {
    var maxlength = 100;
    var object = document.getElementById(text.id)
    if (object.value.length > maxlength) {
        object.focus();
        object.value = text.value.substring(0, maxlength);
        object.scrollTop = object.scrollHeight;
        return false;
    }
    return true;
}
$(function () {
    $("[rel='tooltip']").tooltip({ html: true });
});
function convertstr2(strval, type) {
    $('#convert_utf').removeClass('active');
    $('#convert_original').removeClass('active');
    $('#convert_default').removeClass('active');
    if (type == 'hex') {
        if (rawinput != "") {
            tmpval = hex2asc(rawinput);
        } else {
            tmpval = hex2utf8(strval);
        }
        document.getElementById('inputdata').innerHTML = tmpval;
        currentmode = 'asc';
        $('#convert_utf').addClass('active');
    } else if (type == 'original') {
        tmpval = $('#rawinput').text();
        document.getElementById('inputdata').innerHTML = tmpval;
        $('#convert_original').addClass('active');
    } else if (type == 'default') {
        tmpval = asc2hex(strval);
        document.getElementById('inputdata').innerHTML = orival;
        currentmode = 'hex'
        $('#convert_default').addClass('active');
    }
}
function hex2utf8(pStr) {
    var tempstr = ''
    try {
        tempstr = decodeURIComponent(pStr.replace(/\s+/g, '').replace(/[0-9a-f]{2}/g, '%$&'));
    }
    catch (err) {
        for (b = 0; b < pStr.length; b = b + 2) {
            tempstr = tempstr + String.fromCharCode(parseInt(pStr.substr(b, 2), 16));
        }
    }
    return tempstr;
}
function decodeinput() {
    var input = $('#rawinput').text();
    var functionName = LitFunctionName;
    var contractABI = { 'abi': LitContractABI };
    if (functionName && !jQuery.isEmptyObject(contractABI.abi)) {
        var name = functionName.split('(')[0];
        var results = new Canoe.decodeConstructorArgs(name, contractABI.abi, input.substring(10))
        var str = '\n\n';
        str += 'Function: ' + functionName + '\n\n\n';
        str += 'MethodID: ' + input.substring(0, 10) + '\n';
        var strTbl = '<table class="table table-sm table-hover"><thead><tr><th style="width:5%;">#</th><th>Name</th><th>Type</th><th>Data</th></tr></thead><tbody>';
        $.each(results, function (i, item) {
            var _data = '';
            var _link = '';
            var _isAddr = false;
            var _type = item.type.toString();
            var _tempdata = item.data;
            if (_type.indexOf("address") >= 0)
                _isAddr = true;
            if ($.isArray(item.data)) {
                _data = splitArrayData(item.data, _isAddr);
            }
                else if (item.data.toString().indexOf(',') > -1) {
                    var datas = item.data.toString().split(',');
                    $.each(datas, function (d, data) {
                        if (_isAddr) {
                            if (data.indexOf('0x') === -1)
                                _link = '0x' + data;
                            _tempdata = '<a href="/address/' + _link + '">' + data + '</a>';
                        } else {
                            _tempdata = $.sanitize(data);
                        }
                        _data += _tempdata + "<br>";
                    });
                }
                else {
                    if (_isAddr) {
                        if (item.data.indexOf('0x') === -1)
                            _link = '0x' + item.data;
                        _tempdata = '<a href="/address/' + _link + '">' + item.data + '</a>';
                    } else {
                        _tempdata = $.sanitize(_tempdata);
                    }
                    _data += _tempdata;
                }
            strTbl += '<tr><td>' + i.toString() + '</td><td>' + item.name + '</td><td>' + item.type + '</td><td><span style="text-overflow:ellipsis">' + _data + '</span></td></tr>';
        });
        strTbl += '<tr><td align="right" colspan="4"><p align="right" style="margin-top:0px"><i><font size="1">Decoded input inspired by <a href="https://github.com/cryptofinlabs/canoe-solidity" target="_blank" rel="nofollow"> Canoe Solidity</a></font></i></p></td></tbody></table>'; $('#inputDecode').html(strTbl); $('#decodebox').show();
    } else {
        $('#inputDecode').html("<i>No Data</i>");
    }
}
function generateData(data) {
    if ($.isArray(data))
        return splitArrayData;
}
function splitArrayData(datas, _isAddr) {
    var _data = '';
    $.each(datas, function (d, data) {
        if ($.isArray(data)) {
            _data = splitArrayData(data, _isAddr);
        } else {
            if (_isAddr) {
                if (data.indexOf('0x') === -1)
                    _link = '0x' + data; _tempdata = '<a href="/address/' + _link + '">' + data + '</a>';
            } else {
                _tempdata = $.sanitize(data);
            }
            _data += _tempdata + "<br>";
        }
    }); return _data;
}
window.decoded = false;
function decodeInput() {
    if (window.decoded === false) {
        $.ajaxSetup({ cache: true });
        $.getScript("/assets/Js/custom/canoe.min.js?v=0.5.2.0", function () {
            jQuery('#overlay').fadeOut();
            window.parent.document.getElementById('loadingtxframe').style.display = 'none'; decodeinput();
        }); window.decoded = true;
    }
}
function funcDecodeOnclick(type, elemid, eventid, topicid) {
    if (window.decoded === false) {
        $.ajaxSetup({ cache: true });
        $.getScript("/assets/Js/custom/canoe.min.js?v=0.5.2.0", function () {
            jQuery('#overlay').fadeOut();
            window.parent.document.getElementById('loadingtxframe').style.display = 'none';
            funcDecodeOnclick(type, elemid, eventid, topicid);
        });
        window.decoded = true; return;
    }
    if (type == 'Hex') {
        document.getElementById('chunk_decode_' + elemid).innerHTML = document.getElementById('chunk_decodeori_' + elemid).innerHTML;
    } else if (type == 'Dec') {
        var _contractAbi = JSON.parse(document.getElementById('funcabi_' + eventid).innerHTML.split('(')[0].replace(/ /g, ''));
        var contractAbi = { 'abi': _contractAbi };
        var inputs = document.getElementById('eventlogvalues_' + eventid).innerHTML.replace(/ /g, '');
        var name = document.getElementById('funcname_' + eventid).innerHTML.split('(')[0].replace(/ /g, '');
        var result = new Canoe.decodeConstructorArgs(name, contractAbi.abi, inputs);
        var id = parseInt(topicid);
        var _result = result[id]; document.getElementById('chunk_decode_' + elemid).innerHTML = (_result.type === "address") ? hex2addr(_result.data) : _result.data;
    }
    document.getElementById('convert_decode_btn_' + elemid).innerHTML = type;
}
function copy(id) {
    var range = document.createRange();
    range.selectNode(document.getElementById(id));
    var selectionRange = window.getSelection();
    selectionRange.removeAllRanges()
    window.getSelection().addRange(range);
    document.execCommand("Copy");
    try {
        window.getSelection().removeRange(range);
    } catch (err) { }
}
$(function () {
    var ele; var a = 0;
    $(document).on('click', '.trigger-tooltip', function () {
        if (a == 0) {
            a = 1; copy('tx');
            ele = this;
            $(ele).attr('title', "Txn Hash copied to clipboard");
            $(ele).attr('data-original-title', "Txn Hash copied to clipboard");
            $(ele).addClass("on");
            $(ele).tooltip({
                items: '.trigger-tooltip.on', position: {
                    my: "left+30 center", at: "right center", collision: "flip"
                }
            }); if (ele.id == 'cp') {
                $(ele).attr('title', "Copy Txn Hash to clipboard");
            }
            $(ele).trigger('mouseenter');
            setTimeout(function () {
                $(ele).blur();
                $(ele).attr('data-original-title', "");
                a = 0;
            }, 1500);
        }
    }); $('#cp').on('mouseout', function (e) {
        e.stopImmediatePropagation();
    }); $('#a').on('mouseout', function (e) {
        e.stopImmediatePropagation();
    });
}); (function ($) {
    $.sanitize = function (val) {
        var temp = document.createElement('div');
        temp.textContent = val; return temp.innerHTML;
    };
})(jQuery);
var stateChangeLoaded = false;
function loadStateChangeIframeSource() {
    if (stateChangeLoaded == false) {
        stateChangeLoaded = true;
        document.getElementById('overlayMain').style.display = 'block';
        document.getElementById('statechangeframe').src = '/accountstatediff?m=' + window.mode + '&a=' + litTxHash;
    }
}