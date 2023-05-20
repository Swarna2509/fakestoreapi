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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.49379310344827587, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.25, 500, 1500, "Delete a product"], "isController": false}, {"data": [0.06, 500, 1500, "Get carts in a date range"], "isController": false}, {"data": [0.0, 500, 1500, "Get a single user"], "isController": false}, {"data": [0.0, 500, 1500, "Delete a cart"], "isController": false}, {"data": [0.9933333333333333, 500, 1500, "Update a product"], "isController": false}, {"data": [0.9866666666666667, 500, 1500, "Add a new cart"], "isController": false}, {"data": [0.19666666666666666, 500, 1500, "User login"], "isController": false}, {"data": [0.8366666666666667, 500, 1500, "Get all products"], "isController": false}, {"data": [0.0, 500, 1500, "Get all users"], "isController": false}, {"data": [0.01, 500, 1500, "Add a new user"], "isController": false}, {"data": [0.02, 500, 1500, "Get user carts"], "isController": false}, {"data": [0.3622222222222222, 500, 1500, "Sort results"], "isController": false}, {"data": [0.9833333333333333, 500, 1500, "Update a cart - patch"], "isController": false}, {"data": [0.37555555555555553, 500, 1500, "Limit results"], "isController": false}, {"data": [0.14, 500, 1500, "Delete a user"], "isController": false}, {"data": [0.9866666666666667, 500, 1500, "Get a single product"], "isController": false}, {"data": [0.3466666666666667, 500, 1500, "Get products in a specific category"], "isController": false}, {"data": [0.9866666666666667, 500, 1500, "Update a product - patch"], "isController": false}, {"data": [0.20333333333333334, 500, 1500, "Get all carts"], "isController": false}, {"data": [0.9833333333333333, 500, 1500, "Add new product"], "isController": false}, {"data": [0.9833333333333333, 500, 1500, "Update a cart"], "isController": false}, {"data": [0.9833333333333333, 500, 1500, "Get all categories"], "isController": false}, {"data": [0.9966666666666667, 500, 1500, "Update a users - patch"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "Get a single cart"], "isController": false}, {"data": [0.9933333333333333, 500, 1500, "Update a users"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 4350, 0, 0.0, 1389.4765517241394, 370, 5900, 891.0, 2509.0, 2599.0, 5565.0, 85.62149394744611, 172.05943297288653, 20.964233650723354], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Delete a product", 150, 0, 0.0, 1467.6399999999999, 548, 3067, 1501.0, 2221.8, 2308.9, 2765.0800000000054, 10.73191672032625, 11.553858571224154, 2.242802908349431], "isController": false}, {"data": ["Get carts in a date range", 150, 0, 0.0, 2591.393333333332, 1120, 5604, 2454.5, 5493.0, 5550.7, 5596.35, 5.714938850154303, 9.140255910199262, 0.9097021802491714], "isController": false}, {"data": ["Get a single user", 150, 0, 0.0, 2536.079999999999, 1967, 5579, 2399.5, 2580.9, 5527.2, 5572.88, 5.221750330710854, 5.044088434693309, 0.6374206946668524], "isController": false}, {"data": ["Delete a cart", 150, 0, 0.0, 2664.113333333335, 1907, 5681, 2430.0, 2998.8000000000006, 5517.7, 5681.0, 5.254676662229384, 4.277498379808029, 1.0827507575492188], "isController": false}, {"data": ["Update a product", 150, 0, 0.0, 396.28000000000014, 371, 739, 393.0, 405.0, 408.45, 668.1100000000013, 12.627325532452227, 10.264141289249936, 4.389968642141595], "isController": false}, {"data": ["Add a new cart", 150, 0, 0.0, 397.07333333333327, 371, 605, 391.0, 403.0, 408.34999999999997, 603.98, 5.626406601650412, 4.459440055326332, 2.3186949081020254], "isController": false}, {"data": ["User login", 150, 0, 0.0, 1575.6000000000006, 547, 2570, 1701.5, 2373.2, 2459.75, 2545.5200000000004, 7.606105167080776, 6.33089409766239, 1.8792427805385123], "isController": false}, {"data": ["Get all products", 150, 0, 0.0, 559.4400000000003, 387, 2870, 417.0, 803.0, 1005.8999999999995, 2197.820000000012, 14.112334180073384, 156.06606189434567, 1.7364786198137172], "isController": false}, {"data": ["Get all users", 150, 0, 0.0, 2615.760000000001, 2119, 5900, 2424.5, 2668.3, 5587.5999999999985, 5789.840000000002, 5.21412680756396, 18.80290166156841, 0.6263062473929366], "isController": false}, {"data": ["Add a new user", 150, 0, 0.0, 2224.3799999999987, 1459, 5690, 2089.0, 2557.2, 2657.5499999999997, 5684.9, 5.637826054273472, 3.8872737235022172, 3.512629904908667], "isController": false}, {"data": ["Get user carts", 150, 0, 0.0, 2702.34, 1346, 5668, 2473.0, 5467.4, 5533.849999999999, 5637.400000000001, 5.4336013910019565, 4.4260503830688975, 0.6898126765920451], "isController": false}, {"data": ["Sort results", 450, 0, 0.0, 1791.1533333333325, 373, 5816, 1950.0, 2620.7000000000003, 5522.35, 5672.2300000000005, 9.77368489639894, 52.983086434668344, 1.278978296989705], "isController": false}, {"data": ["Update a cart - patch", 150, 0, 0.0, 433.7866666666667, 374, 2971, 393.0, 403.9, 410.9, 2914.3900000000012, 5.621978186724635, 4.447145791949327, 2.3333405560136424], "isController": false}, {"data": ["Limit results", 450, 0, 0.0, 1833.34888888889, 376, 5667, 2020.0, 2616.100000000001, 5527.25, 5614.72, 10.231690957458902, 21.95776834030604, 1.3189289124849366], "isController": false}, {"data": ["Delete a user", 150, 0, 0.0, 1796.6600000000005, 567, 2668, 1925.5, 2508.8, 2549.0499999999997, 2630.7700000000004, 6.9322488215177005, 6.782230624364543, 1.4284223645900729], "isController": false}, {"data": ["Get a single product", 150, 0, 0.0, 406.06000000000006, 377, 1351, 392.0, 405.8, 413.9, 1183.210000000003, 14.787066246056783, 15.916890526419559, 1.8483832807570977], "isController": false}, {"data": ["Get products in a specific category", 150, 0, 0.0, 1123.033333333333, 543, 2111, 992.0, 1952.7, 2088.15, 2111.0, 12.650754828371426, 27.652276872311717, 1.7790123977397319], "isController": false}, {"data": ["Update a product - patch", 150, 0, 0.0, 400.67999999999995, 373, 758, 393.5, 407.0, 420.74999999999983, 678.9500000000014, 12.615643397813288, 10.256288109756097, 4.41054720353238], "isController": false}, {"data": ["Get all carts", 150, 0, 0.0, 1660.7733333333324, 552, 2494, 1792.0, 2432.7, 2460.45, 2493.49, 9.454178747006177, 15.113391056346906, 1.135609361212656], "isController": false}, {"data": ["Add new product", 150, 0, 0.0, 401.47999999999996, 374, 777, 392.0, 405.9, 415.79999999999995, 758.6400000000003, 12.628388617612393, 10.303811405539653, 4.415003051860583], "isController": false}, {"data": ["Update a cart", 150, 0, 0.0, 425.98666666666674, 375, 2859, 391.5, 404.8, 408.45, 2848.8, 5.6226103905840015, 4.446035239710623, 2.3226212843916336], "isController": false}, {"data": ["Get all categories", 150, 0, 0.0, 402.14666666666636, 370, 770, 392.0, 405.9, 413.9, 764.9000000000001, 14.810426540284361, 11.013326298380727, 1.981473082049763], "isController": false}, {"data": ["Update a users - patch", 150, 0, 0.0, 398.62666666666644, 371, 1338, 392.0, 405.0, 410.45, 870.3300000000083, 6.992029086841001, 6.662821050668905, 4.376846332680744], "isController": false}, {"data": ["Get a single cart", 150, 0, 0.0, 1845.8400000000004, 550, 5513, 2124.5, 2478.9, 2502.45, 3989.6300000000274, 7.205995388162951, 5.8580614070907, 0.8796381089066103], "isController": false}, {"data": ["Update a users", 150, 0, 0.0, 396.14000000000016, 376, 603, 394.0, 405.9, 411.0, 597.9000000000001, 6.9926809938930585, 6.665718527108293, 4.363596831150063], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 4350, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
