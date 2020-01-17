//function setcookie(add)
//{
//    $.ajax({
//        type: "post",
//        url: "/ajax/ajax.ashx?action=login",
//        data: { address: function () { return add } },
//        success: function (da) {

//        }
//    })
//}
var adminurl = "https://cnesch.me";
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

    if (arr = document.cookie.match(reg))

        return unescape(arr[2]);
    else
        return null;
}
function setCookie(name, value) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";path=/;expires=" + exp.toGMTString();
}
function updateuser(accounts, parentaccount, number, MsBo, childcount)
{
    $.ajax({
        type: "post",
        url: adminurl+"/ajax/ajax.ashx?action=updatehy",
        data: {
            accounts: function () { return accounts; },
            parentaccount: function () { return parentaccount },
            number: function () { return number },
            MsBo: function () { return MsBo },
            childcount: function () { return childcount }
        },
        success: function (res1) {

        }
    })
}
function changelan() {
    var lang = getCookie("EschLanguage");
    
    if (lang == "ch") {
        setCookie("EschLanguage", "en");
        location.href = "/esch/En/index.html";
    } else {
        setCookie("EschLanguage", "ch");
        location.href = "/esch/index.html";
    }
}
function login(address)
{
    setCookie("UserAddressESCH", address);
    $.ajax({
        type: "post",
        url:adminurl+ "/ajax/ajax.ashx?action=login",
        data: { address: function () { return address } },
        success: function (da) {

        }
    })
  
}
function Request(name) {

    var url = location.search; //获取url中含"?"符后的字串

    var theRequest = new Object();
    var value = "";
    if (url.indexOf("?") != -1) {

        var str = url.substr(1);

        strs = str.split("&");

        for (var i = 0; i < strs.length; i++) {
            if (strs[i].split("=")[0] == name)
            {
                value = strs[i].split("=")[1];
            }
            //theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);

        }

    }

    return value;

}