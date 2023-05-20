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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7041379310344827, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "Delete a product"], "isController": false}, {"data": [0.5, 500, 1500, "Get carts in a date range"], "isController": false}, {"data": [0.5, 500, 1500, "Get a single user"], "isController": false}, {"data": [0.5, 500, 1500, "Delete a cart"], "isController": false}, {"data": [0.98, 500, 1500, "Update a product"], "isController": false}, {"data": [1.0, 500, 1500, "Add a new cart"], "isController": false}, {"data": [0.5, 500, 1500, "User login"], "isController": false}, {"data": [0.51, 500, 1500, "Get all products"], "isController": false}, {"data": [0.5, 500, 1500, "Get all users"], "isController": false}, {"data": [0.5, 500, 1500, "Add a new user"], "isController": false}, {"data": [0.5, 500, 1500, "Get user carts"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "Sort results"], "isController": false}, {"data": [0.99, 500, 1500, "Update a cart - patch"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "Limit results"], "isController": false}, {"data": [0.5, 500, 1500, "Delete a user"], "isController": false}, {"data": [1.0, 500, 1500, "Get a single product"], "isController": false}, {"data": [0.5, 500, 1500, "Get products in a specific category"], "isController": false}, {"data": [0.99, 500, 1500, "Update a product - patch"], "isController": false}, {"data": [0.5, 500, 1500, "Get all carts"], "isController": false}, {"data": [0.96, 500, 1500, "Add new product"], "isController": false}, {"data": [1.0, 500, 1500, "Update a cart"], "isController": false}, {"data": [1.0, 500, 1500, "Get all categories"], "isController": false}, {"data": [0.99, 500, 1500, "Update a users - patch"], "isController": false}, {"data": [0.5, 500, 1500, "Get a single cart"], "isController": false}, {"data": [1.0, 500, 1500, "Update a users"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1450, 0, 0.0, 536.0399999999998, 373, 1805, 555.0, 760.9000000000001, 789.0, 885.7500000000007, 58.34070974491028, 117.22977815442182, 14.284593903395832], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Delete a product", 50, 0, 0.0, 593.8200000000002, 538, 790, 565.0, 701.8, 750.4499999999998, 790.0, 5.110384300899428, 5.501648098937039, 1.0679904691332787], "isController": false}, {"data": ["Get carts in a date range", 50, 0, 0.0, 628.7399999999999, 549, 804, 597.5, 764.1, 788.1499999999999, 804.0, 4.767353165522502, 7.622550772311214, 0.7588657870900076], "isController": false}, {"data": ["Get a single user", 50, 0, 0.0, 632.8400000000001, 544, 821, 606.5, 775.5, 799.8, 821.0, 4.720543806646526, 4.558828302020393, 0.576238257647281], "isController": false}, {"data": ["Delete a cart", 50, 0, 0.0, 632.5399999999998, 546, 843, 581.5, 783.0, 809.4499999999999, 843.0, 4.7232193463064425, 3.846471755148309, 0.9732414863971283], "isController": false}, {"data": ["Update a product", 50, 0, 0.0, 400.0999999999999, 377, 610, 391.5, 405.8, 487.2999999999993, 610.0, 5.307855626326964, 4.3167794585987265, 1.8453091825902335], "isController": false}, {"data": ["Add a new cart", 50, 0, 0.0, 392.61999999999995, 377, 414, 391.5, 404.9, 408.9, 414.0, 4.803535402055913, 3.8030490440964546, 1.979581972331636], "isController": false}, {"data": ["User login", 50, 0, 0.0, 603.3399999999999, 547, 924, 566.5, 763.1999999999999, 785.5999999999999, 924.0, 4.916420845624385, 4.086006637168142, 1.214701634709931], "isController": false}, {"data": ["Get all products", 50, 0, 0.0, 833.52, 399, 1805, 783.0, 1123.2999999999997, 1475.0999999999976, 1805.0, 4.896680050925473, 54.15288200225247, 0.6025211781412202], "isController": false}, {"data": ["Get all users", 50, 0, 0.0, 641.52, 541, 849, 605.5, 791.5999999999999, 809.6999999999999, 849.0, 4.722773212430339, 17.030393997355247, 0.5672862354774724], "isController": false}, {"data": ["Add a new user", 50, 0, 0.0, 634.0600000000001, 544, 1448, 576.0, 766.4, 810.4499999999999, 1448.0, 4.76417341591234, 3.282441043353978, 2.9683033587422583], "isController": false}, {"data": ["Get user carts", 50, 0, 0.0, 639.24, 542, 832, 612.5, 798.6999999999999, 826.15, 832.0, 4.740235115661737, 3.8618102957906713, 0.601787661167994], "isController": false}, {"data": ["Sort results", 150, 0, 0.0, 560.1333333333332, 380, 1164, 564.5, 773.6, 786.8, 1042.1100000000022, 7.207380357486066, 39.070101533970785, 0.9431532889679031], "isController": false}, {"data": ["Update a cart - patch", 50, 0, 0.0, 394.1599999999999, 376, 603, 390.0, 400.9, 405.9, 603.0, 4.798925040790863, 3.791900614262405, 1.991741349937614], "isController": false}, {"data": ["Limit results", 150, 0, 0.0, 548.94, 377, 813, 558.5, 747.6, 783.1499999999999, 807.9000000000001, 7.555152614082805, 16.216721913720157, 0.9739063916591115], "isController": false}, {"data": ["Delete a user", 50, 0, 0.0, 613.3399999999997, 542, 816, 564.0, 787.3, 802.15, 816.0, 4.813246053138236, 4.702503790431267, 0.9917919113400077], "isController": false}, {"data": ["Get a single product", 50, 0, 0.0, 390.56, 375, 424, 389.5, 398.9, 402.25, 424.0, 5.3361792956243335, 5.74035318836713, 0.6670224119530417], "isController": false}, {"data": ["Get products in a specific category", 50, 0, 0.0, 564.4799999999999, 536, 617, 562.0, 579.9, 596.9999999999999, 617.0, 5.2099614462852974, 11.389667669584245, 0.73265082838387], "isController": false}, {"data": ["Update a product - patch", 50, 0, 0.0, 400.0800000000001, 379, 757, 393.0, 403.0, 411.45, 757.0, 5.296049147336087, 4.306556839847474, 1.8515484323694522], "isController": false}, {"data": ["Get all carts", 50, 0, 0.0, 606.24, 543, 826, 563.5, 758.1999999999999, 795.1499999999999, 826.0, 4.974134500596897, 7.951231720055711, 0.5974790464584162], "isController": false}, {"data": ["Add new product", 50, 0, 0.0, 409.62, 376, 608, 393.0, 416.7, 596.25, 608.0, 5.308982798895732, 4.337397470269696, 1.8560701582076875], "isController": false}, {"data": ["Update a cart", 50, 0, 0.0, 390.6199999999999, 379, 416, 390.0, 400.0, 405.45, 416.0, 4.800768122899664, 3.797107537205953, 1.983129800768123], "isController": false}, {"data": ["Get all categories", 50, 0, 0.0, 391.08, 373, 406, 391.5, 399.9, 402.0, 406.0, 5.335040546308152, 3.962934805804524, 0.7137700730900555], "isController": false}, {"data": ["Update a users - patch", 50, 0, 0.0, 396.36, 377, 598, 391.5, 405.8, 410.79999999999995, 598.0, 4.892367906066536, 4.660362646771037, 3.062507644324853], "isController": false}, {"data": ["Get a single cart", 50, 0, 0.0, 636.58, 541, 973, 566.0, 833.4, 929.05, 973.0, 4.853897679836909, 3.9453087078924374, 0.5925168066207164], "isController": false}, {"data": ["Update a users", 50, 0, 0.0, 392.48000000000013, 378, 414, 390.5, 403.8, 408.0, 414.0, 4.891889247627434, 4.663919565111046, 3.0526535441737597], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1450, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
