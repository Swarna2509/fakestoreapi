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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.445948275862069, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.1725, 500, 1500, "Delete a product"], "isController": false}, {"data": [0.02, 500, 1500, "Get carts in a date range"], "isController": false}, {"data": [0.0, 500, 1500, "Get a single user"], "isController": false}, {"data": [0.0, 500, 1500, "Delete a cart"], "isController": false}, {"data": [0.94, 500, 1500, "Update a product"], "isController": false}, {"data": [0.965, 500, 1500, "Add a new cart"], "isController": false}, {"data": [0.16, 500, 1500, "User login"], "isController": false}, {"data": [0.6375, 500, 1500, "Get all products"], "isController": false}, {"data": [0.0, 500, 1500, "Get all users"], "isController": false}, {"data": [0.0, 500, 1500, "Add a new user"], "isController": false}, {"data": [0.0, 500, 1500, "Get user carts"], "isController": false}, {"data": [0.2791666666666667, 500, 1500, "Sort results"], "isController": false}, {"data": [0.98, 500, 1500, "Update a cart - patch"], "isController": false}, {"data": [0.32, 500, 1500, "Limit results"], "isController": false}, {"data": [0.0475, 500, 1500, "Delete a user"], "isController": false}, {"data": [0.9275, 500, 1500, "Get a single product"], "isController": false}, {"data": [0.2825, 500, 1500, "Get products in a specific category"], "isController": false}, {"data": [0.93, 500, 1500, "Update a product - patch"], "isController": false}, {"data": [0.1375, 500, 1500, "Get all carts"], "isController": false}, {"data": [0.935, 500, 1500, "Add new product"], "isController": false}, {"data": [0.9775, 500, 1500, "Update a cart"], "isController": false}, {"data": [0.9525, 500, 1500, "Get all categories"], "isController": false}, {"data": [0.97, 500, 1500, "Update a users - patch"], "isController": false}, {"data": [0.115, 500, 1500, "Get a single cart"], "isController": false}, {"data": [0.985, 500, 1500, "Update a users"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 5800, 0, 0.0, 1764.2320689655207, 372, 4940, 1399.5, 3301.0, 3375.0, 4466.0, 92.43027888446214, 185.7453156125498, 22.631349601593627], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Delete a product", 200, 0, 0.0, 2010.5000000000007, 583, 3231, 2147.5, 3079.3, 3141.8, 3230.8500000000004, 12.234660794029486, 13.169584824432617, 2.5568529393772557], "isController": false}, {"data": ["Get carts in a date range", 200, 0, 0.0, 3224.305000000001, 1383, 4626, 3257.5, 4447.4, 4568.3, 4604.92, 6.690753378830457, 10.697103321959053, 1.0650320319818012], "isController": false}, {"data": ["Get a single user", 200, 0, 0.0, 3224.0899999999992, 2852, 4509, 3192.5, 3349.5, 3928.3499999999995, 4335.95, 5.948839976204639, 5.748124721148127, 0.726176754907793], "isController": false}, {"data": ["Delete a cart", 200, 0, 0.0, 3369.1699999999996, 2721, 4940, 3249.5, 4181.4, 4420.499999999999, 4605.95, 5.8844297987525005, 4.796902123543604, 1.2125143432976344], "isController": false}, {"data": ["Update a product", 200, 0, 0.0, 462.89000000000016, 375, 1630, 416.0, 665.9000000000001, 710.75, 1434.7000000000003, 14.759058372075861, 11.995049950188179, 5.131078887166999], "isController": false}, {"data": ["Add a new cart", 200, 0, 0.0, 439.22999999999996, 373, 2890, 392.0, 409.8, 613.9, 1395.88, 6.601749463607856, 5.234400788083842, 2.7206428453540186], "isController": false}, {"data": ["User login", 200, 0, 0.0, 2233.8799999999983, 551, 3334, 2583.0, 3144.8, 3284.95, 3330.96, 7.855459544383346, 6.538519368617439, 1.940850844461901], "isController": false}, {"data": ["Get all products", 200, 0, 0.0, 789.19, 394, 2634, 574.0, 1464.9000000000003, 1730.4999999999995, 2629.1400000000017, 17.248814144027598, 190.74476471539455, 2.122412677878396], "isController": false}, {"data": ["Get all users", 200, 0, 0.0, 3353.965000000001, 2996, 4695, 3247.0, 4031.0000000000005, 4431.799999999999, 4685.51, 5.8780308596620126, 21.193975018368846, 0.7060525349008082], "isController": false}, {"data": ["Add a new user", 200, 0, 0.0, 3049.84, 1924, 4549, 2953.5, 3407.1, 4175.799999999998, 4505.92, 6.365980201801572, 4.3896977054620105, 3.966304071044339], "isController": false}, {"data": ["Get user carts", 200, 0, 0.0, 3353.2499999999986, 1818, 4757, 3266.5, 4321.4, 4498.65, 4735.800000000001, 6.299807855860396, 5.13502013969824, 0.7997802942010269], "isController": false}, {"data": ["Sort results", 600, 0, 0.0, 2209.3033333333346, 377, 4767, 2894.0, 3322.0, 3369.95, 4327.76, 10.478519035976248, 56.80731940927349, 1.3712124519734545], "isController": false}, {"data": ["Update a cart - patch", 200, 0, 0.0, 420.30999999999995, 376, 1658, 391.5, 407.8, 421.84999999999997, 1415.6500000000003, 6.386103838048406, 5.0514455544734655, 2.6504825499712625], "isController": false}, {"data": ["Limit results", 600, 0, 0.0, 2152.949999999999, 376, 4824, 2871.5, 3314.0, 3360.95, 4529.330000000001, 11.07951397865347, 23.77832489289803, 1.4282185988107987], "isController": false}, {"data": ["Delete a user", 200, 0, 0.0, 2659.2850000000017, 898, 4345, 2809.5, 3267.8, 4131.249999999998, 4339.83, 6.856359273225917, 6.703497278882413, 1.4127849674322934], "isController": false}, {"data": ["Get a single product", 200, 0, 0.0, 477.9100000000002, 375, 1093, 434.0, 714.6, 818.6499999999999, 1041.8400000000001, 18.106101756291867, 19.48952109360855, 2.263262719536484], "isController": false}, {"data": ["Get products in a specific category", 200, 0, 0.0, 1461.8250000000003, 546, 3653, 1358.5, 2603.7, 2812.5999999999995, 2974.96, 14.579384749963552, 31.86834246063566, 2.0502259804636243], "isController": false}, {"data": ["Update a product - patch", 200, 0, 0.0, 483.4799999999996, 375, 1934, 407.0, 664.7, 918.4999999999992, 1472.7700000000002, 14.774322227967792, 12.009186627391593, 5.165241560168427], "isController": false}, {"data": ["Get all carts", 200, 0, 0.0, 2330.7200000000007, 593, 3385, 2790.0, 3330.8, 3360.0, 3382.99, 10.576414595452142, 16.910488828662082, 1.2704091750396616], "isController": false}, {"data": ["Add new product", 200, 0, 0.0, 470.24500000000006, 375, 1664, 410.0, 658.9, 731.9999999999995, 1593.6100000000013, 14.766686355581808, 12.060229621972828, 5.1625719875959835], "isController": false}, {"data": ["Update a cart", 200, 0, 0.0, 420.785, 372, 2215, 391.0, 403.0, 411.0, 1426.5500000000004, 6.383250351078769, 5.049001420273203, 2.6368309555725773], "isController": false}, {"data": ["Get all categories", 200, 0, 0.0, 453.47000000000037, 374, 1112, 423.5, 480.70000000000005, 720.0499999999997, 1077.5500000000004, 17.962996227770795, 13.354365008083349, 2.403252425004491], "isController": false}, {"data": ["Update a users - patch", 200, 0, 0.0, 433.53000000000003, 373, 1580, 394.0, 407.0, 590.3999999999992, 1420.94, 6.977149834292692, 6.65118611547183, 4.367532269317984], "isController": false}, {"data": ["Get a single cart", 200, 0, 0.0, 2556.3050000000003, 635, 3683, 3076.5, 3288.7, 3333.0, 3389.8900000000003, 9.09090909090909, 7.3798828125, 1.1097301136363635], "isController": false}, {"data": ["Update a users", 200, 0, 0.0, 397.7950000000001, 373, 602, 393.0, 404.0, 412.0, 600.98, 6.974473427256242, 6.64652333397266, 4.352234882828847], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 5800, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
