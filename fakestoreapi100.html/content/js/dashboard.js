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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6267241379310344, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.48, 500, 1500, "Delete a product"], "isController": false}, {"data": [0.265, 500, 1500, "Get carts in a date range"], "isController": false}, {"data": [0.335, 500, 1500, "Get a single user"], "isController": false}, {"data": [0.305, 500, 1500, "Delete a cart"], "isController": false}, {"data": [0.96, 500, 1500, "Update a product"], "isController": false}, {"data": [0.98, 500, 1500, "Add a new cart"], "isController": false}, {"data": [0.43, 500, 1500, "User login"], "isController": false}, {"data": [0.6, 500, 1500, "Get all products"], "isController": false}, {"data": [0.305, 500, 1500, "Get all users"], "isController": false}, {"data": [0.35, 500, 1500, "Add a new user"], "isController": false}, {"data": [0.255, 500, 1500, "Get user carts"], "isController": false}, {"data": [0.5366666666666666, 500, 1500, "Sort results"], "isController": false}, {"data": [0.99, 500, 1500, "Update a cart - patch"], "isController": false}, {"data": [0.5516666666666666, 500, 1500, "Limit results"], "isController": false}, {"data": [0.405, 500, 1500, "Delete a user"], "isController": false}, {"data": [0.99, 500, 1500, "Get a single product"], "isController": false}, {"data": [0.5, 500, 1500, "Get products in a specific category"], "isController": false}, {"data": [0.975, 500, 1500, "Update a product - patch"], "isController": false}, {"data": [0.44, 500, 1500, "Get all carts"], "isController": false}, {"data": [0.985, 500, 1500, "Add new product"], "isController": false}, {"data": [1.0, 500, 1500, "Update a cart"], "isController": false}, {"data": [0.985, 500, 1500, "Get all categories"], "isController": false}, {"data": [0.99, 500, 1500, "Update a users - patch"], "isController": false}, {"data": [0.385, 500, 1500, "Get a single cart"], "isController": false}, {"data": [1.0, 500, 1500, "Update a users"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2900, 0, 0.0, 860.1375862068978, 371, 2224, 743.0, 1580.0, 1620.0, 1681.0, 83.633741888969, 168.07740401946648, 20.477536950252343], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Delete a product", 100, 0, 0.0, 955.43, 542, 1546, 881.5, 1449.1000000000001, 1499.0499999999997, 1545.85, 8.307717869901138, 8.939396496219988, 1.7361832267176205], "isController": false}, {"data": ["Get carts in a date range", 100, 0, 0.0, 1353.4399999999998, 609, 2224, 1492.5, 1632.0, 1655.6499999999999, 2220.409999999998, 5.797101449275362, 9.268002717391305, 0.9227807971014492], "isController": false}, {"data": ["Get a single user", 100, 0, 0.0, 1401.6799999999994, 1032, 1718, 1384.5, 1636.8000000000002, 1670.85, 1717.79, 5.33731853116994, 5.153014250640478, 0.6515281410119556], "isController": false}, {"data": ["Delete a cart", 100, 0, 0.0, 1414.9599999999998, 938, 2047, 1436.0, 1619.8, 1638.0, 2045.289999999999, 5.382131324004306, 4.3859114303014, 1.1090133880516686], "isController": false}, {"data": ["Update a product", 100, 0, 0.0, 414.8500000000001, 372, 783, 392.0, 411.9, 615.9, 782.99, 9.1726288754357, 7.461360300862228, 3.188921757475693], "isController": false}, {"data": ["Add a new cart", 100, 0, 0.0, 411.5599999999999, 375, 1372, 392.0, 405.9, 413.9, 1367.989999999998, 5.663155510250311, 4.486944656812776, 2.3338394778570617], "isController": false}, {"data": ["User login", 100, 0, 0.0, 999.2400000000002, 536, 1637, 1019.0, 1557.5000000000002, 1576.95, 1636.92, 6.778282383244086, 5.64477352063987, 1.6747123466413611], "isController": false}, {"data": ["Get all products", 100, 0, 0.0, 727.1699999999997, 394, 1191, 783.0, 814.8, 1014.6499999999996, 1190.95, 9.552923194497517, 105.64413569927397, 1.1754573461979365], "isController": false}, {"data": ["Get all users", 100, 0, 0.0, 1421.3600000000001, 1069, 1676, 1411.0, 1627.2, 1643.0, 1675.96, 5.326799126404943, 19.207584529643636, 0.6398401294412188], "isController": false}, {"data": ["Add a new user", 100, 0, 0.0, 1247.34, 615, 1681, 1222.5, 1635.8, 1661.4499999999998, 1680.98, 5.936832106388032, 4.094674847126573, 3.6989246912847302], "isController": false}, {"data": ["Get user carts", 100, 0, 0.0, 1381.9699999999998, 754, 1817, 1496.0, 1619.9, 1646.95, 1816.1999999999996, 5.549697541483988, 4.521377608357845, 0.7045514456962096], "isController": false}, {"data": ["Sort results", 300, 0, 0.0, 998.1733333333333, 376, 1929, 1048.5, 1611.9, 1650.6499999999999, 1704.92, 9.71502590673575, 52.66733120142487, 1.2713022182642488], "isController": false}, {"data": ["Update a cart - patch", 100, 0, 0.0, 395.63999999999993, 375, 601, 391.0, 404.8, 407.0, 600.97, 5.670863105364636, 4.492165348190994, 2.3536297068163776], "isController": false}, {"data": ["Limit results", 300, 0, 0.0, 996.2766666666668, 378, 2191, 1107.0, 1614.0, 1641.95, 1694.99, 10.096250925489668, 21.668947087231608, 1.3014698458639027], "isController": false}, {"data": ["Delete a user", 100, 0, 0.0, 1072.9299999999998, 541, 1833, 1114.5, 1587.3000000000002, 1615.6, 1832.5299999999997, 6.327512022272842, 6.184525080675778, 1.3038135124019234], "isController": false}, {"data": ["Get a single product", 100, 0, 0.0, 395.7500000000001, 377, 605, 391.5, 402.9, 410.79999999999995, 604.9, 9.986019572598362, 10.746868446674656, 1.2482524465747953], "isController": false}, {"data": ["Get products in a specific category", 100, 0, 0.0, 797.2800000000001, 538, 1472, 703.0, 1269.0, 1346.8499999999997, 1471.3999999999996, 9.095870474804439, 19.88158313625614, 1.2791067855193743], "isController": false}, {"data": ["Update a product - patch", 100, 0, 0.0, 404.35999999999996, 371, 782, 390.0, 403.9, 582.8499999999983, 781.6899999999998, 9.171787581399615, 7.455660139411171, 3.206542923965881], "isController": false}, {"data": ["Get all carts", 100, 0, 0.0, 1036.5, 545, 1660, 933.0, 1518.7, 1543.6499999999999, 1659.6499999999999, 7.613247049866768, 12.172719594594595, 0.9144818233726685], "isController": false}, {"data": ["Add new product", 100, 0, 0.0, 399.0400000000001, 371, 759, 390.0, 403.9, 421.9, 757.4499999999991, 9.258401999814833, 7.565850384223683, 3.2368241366540134], "isController": false}, {"data": ["Update a cart", 100, 0, 0.0, 392.1899999999999, 371, 417, 393.0, 403.0, 404.0, 416.92999999999995, 5.666364460562104, 4.483732221781505, 2.340695475407978], "isController": false}, {"data": ["Get all categories", 100, 0, 0.0, 401.78000000000003, 378, 745, 392.0, 411.8, 430.9, 743.6299999999993, 10.02004008016032, 7.445946580661323, 1.3405717685370742], "isController": false}, {"data": ["Update a users - patch", 100, 0, 0.0, 406.41, 377, 1366, 394.5, 404.9, 423.5999999999999, 1358.4899999999961, 6.395906619763352, 6.096972937320115, 4.003687639910457], "isController": false}, {"data": ["Get a single cart", 100, 0, 0.0, 1136.0100000000002, 545, 1857, 1158.0, 1621.7, 1660.0, 1855.4999999999993, 7.0293828201883874, 5.718238173063405, 0.8580789575425277], "isController": false}, {"data": ["Update a users", 100, 0, 0.0, 393.74999999999994, 375, 469, 394.0, 402.0, 405.95, 468.66999999999985, 6.398362019323053, 6.10468720007678, 3.9927278616674133], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2900, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
