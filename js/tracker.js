function getQueryParam(param, withName=true) {
    let url = new URL(window.location.href);
    if (withName) {
        return param + '=' + url.searchParams.get(param)
    }
    return url.searchParams.get(param);
}

function keitaroLead() {
    const revenue = 0;
    const status = 'lead';
    KTracking.reportConversion(revenue, status, {tid});
}

function keitaroConvertion(status) {
    // KTracking.reportConversion(0, status, {tid})
}