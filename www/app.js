var content = document.getElementById('content');
var bundles;

function renderBundleList() {
    var html = '';
    bundles.forEach(function(bundle) {
        html = html + '<div class="row">' + renderBundle(bundle) + '</div>';
    });
    content.innerHTML = html;
}

function renderBundle(bundle, isAnimated) {
    return `
        <div class="col-sm-12">
            <div class="panel panel-primary ${isAnimated?"animateIn":""}">
                <div class="panel-heading">Bundle ID: ${bundle.bundleName}</div>
                <div class="panel-body">
                    <div class="col-md-12 col-lg-7">
                        <table>
                            <tr>
                                <td class="panel-table-label">概要:</td><td>${bundle.bundleDescription}</td>
                            </tr>
                            <tr>
                            <td class="panel-table-label">商品数:</td><td>${bundle.qty}</td>
                        </tr>
                    </table>
                    </div>   
                    <div class="col-md-12 col-lg-5">
                        <button class="btn btn-info" onclick="getBundleDetails('${bundle.bundleId}')" style="margin-bottom: 4px;">
                            <span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span>
                            詳細を見る
                        </button>
                        <button class="btn btn-info" onclick="orderBundle('${bundle.bundleId}')" style="margin-bottom: 4px;">
                            <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>
                            商品セットをオーダー
                        </button>
                    </div>
                    <div id="details-${bundle.bundleId}" class="col-md-12"></div>
                </div>
            </div>
        </div>`;
}

// Render the merchandise list for a bundle
function renderBundleDetails(bundle, items) {
    var html = `
        <table class="table">
            <tr>
                <th colspan="2">商品</th>
                <th>希望小売価格</th>
                <th>数量</th>
            </tr>`;
    items.forEach(function(item) {
        html = html + `
            <tr>
                <td><img src="${item.pictureURL}" style="height:50px"/></td>
                <td>${item.productTitle}</td>
                <td>￥${item.price}</td>
                <td>${item.qty}</td>
            </tr>`
    });
    html = html + "</table>"    
    var details = document.getElementById('details-' + bundle.bundleId);
    details.innerHTML = html;
}

function deleteBundle(bundleId) {
    for (var i = 0; i < bundles.length; i++) {
        if (bundles[i].bundleId === bundleId) {
            bundles.splice(i, 1);
            break;
        }
    }
}

var socket = io.connect();

socket.on('bundle_submitted', function (newBundle) {
    // if the bundle is alresdy in the list: do nothing
    var exists = false;
    bundles.forEach((bundle) => {
        if (bundle.bundleId == newBundle.bundleId) {
            exists = true;
        }
    });
    // if the bundle is not in the list: add it
    if (!exists) {
        bundles.push(newBundle);
        var el = document.createElement("div");
        el.className = "row";
        el.innerHTML = renderBundle(newBundle, true);
        content.insertBefore(el, content.firstChild);
    }
});

socket.on('bundle_unsubmitted', function (data) {
    deleteBundle(data.bundleId);
    renderBundleList();
});

// Retrieve the existing list of bundles from Node server
function getBundleList() {
    var xhr = new XMLHttpRequest(),
        method = 'GET',
        url = '/bundles';

    xhr.open(method, url, true);
    xhr.onload = function () {
        console.log(xhr.responseText);
        bundles = JSON.parse(xhr.responseText);
        renderBundleList();
    };
    xhr.send();
}

// Retrieve the product list for a bundle from Node server
function getBundleDetails(bundleId) {
    var details = document.getElementById('details-' + bundleId);
    if (details.innerHTML != '') {
        details.innerHTML = '';
        return;
    }
    var bundle;
    for (var i=0; i<bundles.length; i++) {
        if (bundles[i].bundleId === bundleId) {
            bundle = bundles[i];
            break;
        }
    };

    var xhr = new XMLHttpRequest(),
        method = 'GET',
        url = '/bundles/' + bundleId;

    xhr.open(method, url, true);
    xhr.onload = function () {
        var items = JSON.parse(xhr.responseText);
        renderBundleDetails(bundle, items);
    };
    xhr.send();
}

// Post approve message to Node server
function orderBundle(bundleId) {
    var xhr = new XMLHttpRequest(),
        method = 'POST',
        url = '/approvals/' + bundleId;

    xhr.open(method, url, true);
    xhr.onload = function () {
        deleteBundle(bundleId);
        renderBundleList();
    };
    xhr.send();
}

getBundleList();