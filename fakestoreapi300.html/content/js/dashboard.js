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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.3956896551724138, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.13833333333333334, 500, 1500, "Delete a product"], "isController": false}, {"data": [0.043333333333333335, 500, 1500, "Get carts in a date range"], "isController": false}, {"data": [0.0016666666666666668, 500, 1500, "Get a single user"], "isController": false}, {"data": [0.0033333333333333335, 500, 1500, "Delete a cart"], "isController": false}, {"data": [0.885, 500, 1500, "Update a product"], "isController": false}, {"data": [0.975, 500, 1500, "Add a new cart"], "isController": false}, {"data": [0.03833333333333333, 500, 1500, "User login"], "isController": false}, {"data": [0.16, 500, 1500, "Get all products"], "isController": false}, {"data": [0.0016666666666666668, 500, 1500, "Get all users"], "isController": false}, {"data": [0.0033333333333333335, 500, 1500, "Add a new user"], "isController": false}, {"data": [0.018333333333333333, 500, 1500, "Get user carts"], "isController": false}, {"data": [0.18444444444444444, 500, 1500, "Sort results"], "isController": false}, {"data": [0.9883333333333333, 500, 1500, "Update a cart - patch"], "isController": false}, {"data": [0.2727777777777778, 500, 1500, "Limit results"], "isController": false}, {"data": [0.013333333333333334, 500, 1500, "Delete a user"], "isController": false}, {"data": [0.8216666666666667, 500, 1500, "Get a single product"], "isController": false}, {"data": [0.18833333333333332, 500, 1500, "Get products in a specific category"], "isController": false}, {"data": [0.915, 500, 1500, "Update a product - patch"], "isController": false}, {"data": [0.095, 500, 1500, "Get all carts"], "isController": false}, {"data": [0.8933333333333333, 500, 1500, "Add new product"], "isController": false}, {"data": [0.9816666666666667, 500, 1500, "Update a cart"], "isController": false}, {"data": [0.86, 500, 1500, "Get all categories"], "isController": false}, {"data": [0.99, 500, 1500, "Update a users - patch"], "isController": false}, {"data": [0.09, 500, 1500, "Get a single cart"], "isController": false}, {"data": [0.9983333333333333, 500, 1500, "Update a users"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 8700, 0, 0.0, 2684.577126436779, 371, 49248, 2490.5, 5090.900000000001, 5209.949999999999, 5843.9299999999985, 87.22941335712925, 175.29530399325228, 21.357929166207125], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Delete a product", 300, 0, 0.0, 3028.369999999999, 602, 5291, 3557.0, 4798.100000000001, 4970.5, 5085.84, 4.749841671944269, 5.113192190468651, 0.992642693160228], "isController": false}, {"data": ["Get carts in a date range", 300, 0, 0.0, 4488.863333333332, 646, 5364, 5055.5, 5262.8, 5292.65, 5348.9400000000005, 3.670667694453621, 5.869005723182713, 0.5842957365194729], "isController": false}, {"data": ["Get a single user", 300, 0, 0.0, 4604.586666666669, 546, 5656, 4509.5, 5065.6, 5128.5, 5225.0, 3.750281271095332, 3.622195492786959, 0.4577980067255044], "isController": false}, {"data": ["Delete a cart", 300, 0, 0.0, 4570.139999999999, 560, 5383, 4574.5, 5140.5, 5205.8, 5297.95, 3.6400257228484416, 2.9647251173908296, 0.7500443628134972], "isController": false}, {"data": ["Update a product", 300, 0, 0.0, 581.1366666666668, 374, 15476, 399.0, 764.0000000000003, 947.4499999999994, 4032.1100000000124, 5.044390637610976, 4.098468869804278, 1.753713932606941], "isController": false}, {"data": ["Add a new cart", 300, 0, 0.0, 415.81000000000023, 375, 1704, 390.0, 405.90000000000003, 451.0, 1442.3300000000042, 3.6261664168640912, 2.8728161790480105, 1.49437717569985], "isController": false}, {"data": ["User login", 300, 0, 0.0, 3804.1433333333302, 546, 5590, 4358.5, 5135.9, 5250.9, 5431.9, 4.948616861587187, 4.121849896079046, 1.2226563144351155], "isController": false}, {"data": ["Get all products", 300, 0, 0.0, 3952.033333333333, 428, 49248, 2376.5, 9913.9, 11840.549999999997, 18483.370000000003, 5.258084304618351, 58.14770287441942, 0.6469908421698362], "isController": false}, {"data": ["Get all users", 300, 0, 0.0, 4591.8399999999965, 745, 5977, 4523.0, 5083.9, 5254.45, 5359.400000000001, 3.663137843877065, 13.208020631097597, 0.44000581523132715], "isController": false}, {"data": ["Add a new user", 300, 0, 0.0, 4769.590000000001, 569, 5909, 4792.0, 5299.9, 5407.85, 5466.89, 4.312017593031779, 2.9732147348827853, 2.6865890862834725], "isController": false}, {"data": ["Get user carts", 300, 0, 0.0, 4544.313333333334, 672, 5553, 5008.0, 5230.200000000001, 5273.9, 5406.95, 3.611716408027642, 2.943360762312943, 0.4585186846128842], "isController": false}, {"data": ["Sort results", 900, 0, 0.0, 3573.932222222225, 376, 19029, 4463.0, 5202.9, 5298.9, 9460.720000000001, 9.423689060144078, 51.08938090943835, 1.2331780606047913], "isController": false}, {"data": ["Update a cart - patch", 300, 0, 0.0, 398.9166666666666, 371, 1070, 391.0, 402.0, 411.9, 638.8600000000001, 3.6441820633358843, 2.8835065079018016, 1.512477907146241], "isController": false}, {"data": ["Limit results", 900, 0, 0.0, 3212.781111111114, 378, 18288, 4401.0, 5060.9, 5131.0, 5398.860000000001, 9.538243055629152, 20.46851485581356, 1.2295391438896954], "isController": false}, {"data": ["Delete a user", 300, 0, 0.0, 4475.8166666666675, 552, 5867, 4711.0, 5286.9, 5368.9, 5462.88, 4.610065309258547, 4.5092501440645405, 0.9499255666538609], "isController": false}, {"data": ["Get a single product", 300, 0, 0.0, 658.5833333333336, 375, 9337, 456.5, 827.8000000000001, 1148.9499999999996, 4703.800000000016, 5.350931953981985, 5.758836005083386, 0.6688664942477481], "isController": false}, {"data": ["Get products in a specific category", 300, 0, 0.0, 2228.5766666666664, 600, 17700, 2004.5, 4029.1000000000004, 4458.8, 5073.96, 5.0051720110781135, 10.939592005489004, 0.7038523140578598], "isController": false}, {"data": ["Update a product - patch", 300, 0, 0.0, 520.67, 371, 4710, 400.0, 769.4000000000002, 959.0999999999998, 4387.420000000018, 5.049824939402101, 4.104495080628872, 1.7654661409237813], "isController": false}, {"data": ["Get all carts", 300, 0, 0.0, 3610.0000000000005, 610, 8449, 4386.5, 5045.7, 5095.85, 5412.370000000003, 4.481022868153371, 7.164006137134237, 0.5382478640457662], "isController": false}, {"data": ["Add new product", 300, 0, 0.0, 528.3033333333334, 372, 4912, 402.0, 775.7, 973.4499999999998, 1933.1000000000026, 5.0352467270896275, 4.110610208962739, 1.7603694612286003], "isController": false}, {"data": ["Update a cart", 300, 0, 0.0, 407.7866666666666, 375, 1403, 391.0, 405.0, 440.0, 789.97, 3.628710356339357, 2.8716895577811643, 1.4989692194644022], "isController": false}, {"data": ["Get all categories", 300, 0, 0.0, 584.8266666666666, 374, 9143, 449.0, 805.9000000000001, 1005.4999999999999, 3394.680000000011, 5.364039479330567, 3.988421776659276, 0.7176498131526249], "isController": false}, {"data": ["Update a users - patch", 300, 0, 0.0, 399.1666666666667, 372, 1419, 392.0, 403.0, 407.0, 596.0, 4.62000462000462, 4.404675107800108, 2.8920146107646105], "isController": false}, {"data": ["Get a single cart", 300, 0, 0.0, 3935.543333333332, 605, 5412, 4902.0, 5088.5, 5123.45, 5263.93, 4.237108597093344, 3.4430921006172057, 0.517225170543621], "isController": false}, {"data": ["Update a users", 300, 0, 0.0, 393.5800000000003, 375, 814, 392.0, 402.90000000000003, 409.0, 418.0, 4.619222122994488, 4.405793611230869, 2.882502867767068], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 8700, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
