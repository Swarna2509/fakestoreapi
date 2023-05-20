/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.67545638945234, "KoPercent": 0.32454361054766734};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4041075050709939, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.11470588235294117, 500, 1500, "Delete a product"], "isController": false}, {"data": [0.020588235294117647, 500, 1500, "Get carts in a date range"], "isController": false}, {"data": [0.020588235294117647, 500, 1500, "Get a single user"], "isController": false}, {"data": [0.01911764705882353, 500, 1500, "Delete a cart"], "isController": false}, {"data": [0.9558823529411765, 500, 1500, "Update a product"], "isController": false}, {"data": [0.9323529411764706, 500, 1500, "Add a new cart"], "isController": false}, {"data": [0.10588235294117647, 500, 1500, "User login"], "isController": false}, {"data": [0.0, 500, 1500, "Get all products"], "isController": false}, {"data": [0.01764705882352941, 500, 1500, "Get all users"], "isController": false}, {"data": [0.025, 500, 1500, "Add a new user"], "isController": false}, {"data": [0.01911764705882353, 500, 1500, "Get user carts"], "isController": false}, {"data": [0.2284313725490196, 500, 1500, "Sort results"], "isController": false}, {"data": [0.9661764705882353, 500, 1500, "Update a cart - patch"], "isController": false}, {"data": [0.30980392156862746, 500, 1500, "Limit results"], "isController": false}, {"data": [0.054411764705882354, 500, 1500, "Delete a user"], "isController": false}, {"data": [0.7867647058823529, 500, 1500, "Get a single product"], "isController": false}, {"data": [0.2073529411764706, 500, 1500, "Get products in a specific category"], "isController": false}, {"data": [0.9691176470588235, 500, 1500, "Update a product - patch"], "isController": false}, {"data": [0.060294117647058824, 500, 1500, "Get all carts"], "isController": false}, {"data": [0.95, 500, 1500, "Add new product"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "Update a cart"], "isController": false}, {"data": [0.9323529411764706, 500, 1500, "Get all categories"], "isController": false}, {"data": [0.9661764705882353, 500, 1500, "Update a users - patch"], "isController": false}, {"data": [0.045588235294117645, 500, 1500, "Get a single cart"], "isController": false}, {"data": [0.9647058823529412, 500, 1500, "Update a users"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 9860, 32, 0.32454361054766734, 7159.270385395554, 371, 2934342, 2993.0, 5716.9, 5913.949999999999, 20546.78, 3.3073752455373917, 6.585056428630968, 0.8089367675388164], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Delete a product", 340, 0, 0.0, 3151.85294117647, 554, 6311, 3827.5, 5236.3, 5306.9, 5457.3099999999995, 0.11515680292200225, 0.12389874427433602, 0.024065972485652818], "isController": false}, {"data": ["Get carts in a date range", 340, 1, 0.29411764705882354, 5006.429411764707, 556, 7200, 5302.0, 5583.0, 5654.9, 6342.149999999998, 0.11515340974326546, 0.1836967437706239, 0.018330083777492453], "isController": false}, {"data": ["Get a single user", 340, 0, 0.0, 5326.358823529412, 548, 6456, 5538.0, 5823.9, 5908.4, 6074.029999999997, 0.11540457619875655, 0.11150383788100905, 0.014087472680512273], "isController": false}, {"data": ["Delete a cart", 340, 2, 0.5882352941176471, 5192.873529411762, 555, 6204, 5344.0, 5719.8, 5832.65, 6081.249999999995, 0.11519086278972619, 0.09354030075148485, 0.023735617234992408], "isController": false}, {"data": ["Update a product", 340, 0, 0.0, 450.7058823529413, 375, 1474, 400.0, 468.0, 733.75, 1322.8899999999933, 0.11519195553590517, 0.09360603652431991, 0.040047203291779535], "isController": false}, {"data": ["Add a new cart", 340, 0, 0.0, 444.29999999999984, 373, 1824, 399.0, 600.0, 677.6999999999999, 1062.6699999999996, 0.11522127228684403, 0.0912503761635654, 0.047483766508836116], "isController": false}, {"data": ["User login", 340, 0, 0.0, 3657.8264705882348, 547, 6331, 3468.0, 5741.1, 5798.65, 6075.289999999999, 0.11625533364084008, 0.09673007404951861, 0.02872324161243412], "isController": false}, {"data": ["Get all products", 340, 21, 6.176470588235294, 129162.76470588235, 9191, 2934342, 17407.0, 27933.600000000002, 39839.24999999991, 2934292.0, 0.11586676004164387, 1.2228772075386662, 0.013376460687941847], "isController": false}, {"data": ["Get all users", 340, 0, 0.0, 5358.138235294121, 554, 6502, 5495.5, 5886.6, 5929.0, 6089.269999999999, 0.1152838593781046, 0.41563778294558396, 0.013847572952643425], "isController": false}, {"data": ["Add a new user", 340, 2, 0.5882352941176471, 4816.102941176471, 558, 6129, 5196.0, 5797.5, 5899.0, 6011.54, 0.11590456009446903, 0.07971734276097617, 0.07221397396510865], "isController": false}, {"data": ["Get user carts", 340, 2, 0.5882352941176471, 5143.5911764705925, 557, 6449, 5368.0, 5781.500000000001, 5867.9, 6024.039999999999, 0.1151800535248484, 0.09351961342694536, 0.01462246773264677], "isController": false}, {"data": ["Sort results", 1020, 1, 0.09803921568627451, 3609.6598039215733, 381, 16207, 5037.5, 5701.7, 5797.9, 5963.79, 0.3436460849614409, 1.8618479568218802, 0.044969311899251053], "isController": false}, {"data": ["Update a cart - patch", 340, 0, 0.0, 415.47352941176473, 374, 1367, 395.0, 458.0, 592.9999999999998, 774.0399999999986, 0.11521467374084762, 0.0911385927052846, 0.04781859017564477], "isController": false}, {"data": ["Limit results", 1020, 2, 0.19607843137254902, 3457.269607843137, 375, 6836, 5014.5, 5727.9, 5803.75, 5978.219999999999, 0.3439031865327512, 0.7370241582084465, 0.04433127013898746], "isController": false}, {"data": ["Delete a user", 340, 1, 0.29411764705882354, 4173.879411764706, 546, 6292, 4868.0, 5711.0, 5788.85, 5975.36, 0.11606305910818511, 0.11327315865530023, 0.023915337374831112], "isController": false}, {"data": ["Get a single product", 340, 0, 0.0, 1216.1823529411758, 378, 14900, 456.0, 1412.7000000000005, 9499.8, 11373.759999999997, 0.11517790752230302, 0.12395585616142522, 0.014397238440287877], "isController": false}, {"data": ["Get products in a specific category", 340, 0, 0.0, 2405.314705882354, 561, 8658, 2170.0, 4970.3, 5168.0, 5344.54, 0.11520846633134225, 0.2517809291105364, 0.016201190577845005], "isController": false}, {"data": ["Update a product - patch", 340, 0, 0.0, 435.54705882352914, 373, 1295, 401.0, 462.0, 638.6999999999999, 1065.8599999999988, 0.11519242386204284, 0.09362957733189274, 0.040272351311143886], "isController": false}, {"data": ["Get all carts", 340, 0, 0.0, 3700.929411764706, 570, 5886, 4210.5, 5254.8, 5315.8, 5462.11, 0.11513531616665769, 0.1840789360954973, 0.013829730359862203], "isController": false}, {"data": ["Add new product", 340, 0, 0.0, 453.52941176470574, 375, 1684, 403.0, 471.7000000000001, 731.0, 1404.429999999988, 0.11518926273451179, 0.0940657170413028, 0.04027124615132346], "isController": false}, {"data": ["Update a cart", 340, 0, 0.0, 414.76176470588223, 371, 1012, 394.0, 441.80000000000007, 599.6499999999999, 921.2099999999996, 0.11522150656864252, 0.09112678860208523, 0.047596384061070106], "isController": false}, {"data": ["Get all categories", 340, 0, 0.0, 466.7088235294122, 377, 1739, 430.5, 639.9000000000008, 754.8499999999999, 1173.2499999999957, 0.11521389289784288, 0.08569231837631094, 0.015414358717777809], "isController": false}, {"data": ["Update a users - patch", 340, 0, 0.0, 429.12647058823535, 374, 1296, 397.0, 445.90000000000003, 662.4499999999998, 1173.1799999999998, 0.116072687448002, 0.11066245200479721, 0.07265878188883719], "isController": false}, {"data": ["Get a single cart", 340, 0, 0.0, 4174.394117647058, 557, 5961, 5106.5, 5359.9, 5406.95, 5646.709999999998, 0.11513360069161431, 0.09357581280935806, 0.014054394615675576], "isController": false}, {"data": ["Update a users", 340, 0, 0.0, 421.2617647058823, 374, 1156, 396.5, 443.0, 605.0, 856.1499999999978, 0.11608639969298562, 0.11069953194987936, 0.07244063418341583], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fakestoreapi.com:443 failed to respond", 6, 18.75, 0.060851926977687626], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 13, 40.625, 0.13184584178498987], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, 6.25, 0.02028397565922921], "isController": false}, {"data": ["502/Bad Gateway", 11, 34.375, 0.11156186612576065], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 9860, 32, "Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 13, "502/Bad Gateway", 11, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fakestoreapi.com:443 failed to respond", 6, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["Get carts in a date range", 340, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Delete a cart", 340, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get all products", 340, 21, "Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 13, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fakestoreapi.com:443 failed to respond", 6, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Add a new user", 340, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get user carts", 340, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Sort results", 1020, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Limit results", 1020, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Delete a user", 340, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
