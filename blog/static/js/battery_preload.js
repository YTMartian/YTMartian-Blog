loading = '<div id="preloader"><div class="loder-box"><div class="battery"></div></div></div>'
document.write(loading);
document.onreadystatechange = completeLoading;

//加载状态为complete时移除loading效果

function completeLoading() {

    if (document.readyState == "complete") {

        var loadingMask = document.getElementById('preloader');

        loadingMask.parentNode.removeChild(loadingMask);

    }

}