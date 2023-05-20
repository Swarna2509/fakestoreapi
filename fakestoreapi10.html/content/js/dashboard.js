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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "Delete a product"], "isController": false}, {"data": [0.5, 500, 1500, "Get carts in a date range"], "isController": false}, {"data": [0.5, 500, 1500, "Get a single user"], "isController": false}, {"data": [0.5, 500, 1500, "Delete a cart"], "isController": false}, {"data": [0.95, 500, 1500, "Update a product"], "isController": false}, {"data": [1.0, 500, 1500, "Add a new cart"], "isController": false}, {"data": [0.5, 500, 1500, "User login"], "isController": false}, {"data": [0.5, 500, 1500, "Get all products"], "isController": false}, {"data": [0.5, 500, 1500, "Get all users"], "isController": false}, {"data": [0.5, 500, 1500, "Add a new user"], "isController": false}, {"data": [0.5, 500, 1500, "Get user carts"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "Sort results"], "isController": false}, {"data": [1.0, 500, 1500, "Update a cart - patch"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "Limit results"], "isController": false}, {"data": [0.5, 500, 1500, "Delete a user"], "isController": false}, {"data": [1.0, 500, 1500, "Get a single product"], "isController": false}, {"data": [0.5, 500, 1500, "Get products in a specific category"], "isController": false}, {"data": [0.95, 500, 1500, "Update a product - patch"], "isController": false}, {"data": [0.5, 500, 1500, "Get all carts"], "isController": false}, {"data": [1.0, 500, 1500, "Add new product"], "isController": false}, {"data": [0.95, 500, 1500, "Update a cart"], "isController": false}, {"data": [1.0, 500, 1500, "Get all categories"], "isController": false}, {"data": [0.95, 500, 1500, "Update a users - patch"], "isController": false}, {"data": [0.5, 500, 1500, "Get a single cart"], "isController": false}, {"data": [1.0, 500, 1500, "Update a users"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 290, 0, 0.0, 512.3275862068965, 387, 1325, 559.0, 581.0, 604.8, 892.3599999999899, 11.861425825187123, 23.8374876017424, 2.9042439107938973], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Delete a product", 10, 0, 0.0, 637.5000000000001, 548, 1260, 563.5, 1196.4, 1260.0, 1260.0, 1.0447137484329294, 1.1249036904513163, 0.21832884977016298], "isController": false}, {"data": ["Get carts in a date range", 10, 0, 0.0, 569.0, 547, 599, 566.5, 598.0, 599.0, 599.0, 1.054629824931449, 1.6851419136258174, 0.1678756459607678], "isController": false}, {"data": ["Get a single user", 10, 0, 0.0, 563.0999999999999, 555, 571, 564.0, 570.8, 571.0, 571.0, 1.0577533319229957, 1.0224260233763485, 0.1291202797757563], "isController": false}, {"data": ["Delete a cart", 10, 0, 0.0, 567.1000000000001, 563, 574, 565.5, 573.8, 574.0, 574.0, 1.056077727320731, 0.8601258052592672, 0.2176097660787834], "isController": false}, {"data": ["Update a product", 10, 0, 0.0, 419.7, 389, 603, 401.0, 583.7, 603.0, 603.0, 1.1466574934067195, 0.9294196479761495, 0.3986426441921798], "isController": false}, {"data": ["Add a new cart", 10, 0, 0.0, 397.1, 394, 403, 396.0, 402.9, 403.0, 403.0, 1.0748065348237317, 0.8499788397463456, 0.4429378493121238], "isController": false}, {"data": ["User login", 10, 0, 0.0, 559.9, 550, 568, 561.0, 567.8, 568.0, 568.0, 1.0323113451016825, 0.8609315319500361, 0.25505348663156807], "isController": false}, {"data": ["Get all products", 10, 0, 0.0, 857.7, 790, 1325, 800.0, 1278.1000000000001, 1325.0, 1325.0, 1.034340091021928, 11.440771100537857, 0.12727231588746382], "isController": false}, {"data": ["Get all users", 10, 0, 0.0, 567.0, 553, 598, 561.5, 597.0, 598.0, 598.0, 1.0577533319229957, 3.8122504363232492, 0.1270543552993442], "isController": false}, {"data": ["Add a new user", 10, 0, 0.0, 561.1, 550, 568, 561.0, 567.9, 568.0, 568.0, 1.0532968190436063, 0.7255816173372657, 0.6562532915525595], "isController": false}, {"data": ["Get user carts", 10, 0, 0.0, 567.0, 555, 581, 567.5, 580.5, 581.0, 581.0, 1.0569707219110032, 0.8629175034351548, 0.13418573618010782], "isController": false}, {"data": ["Sort results", 30, 0, 0.0, 513.0, 395, 607, 560.5, 577.8, 598.75, 607.0, 1.4971554047310112, 8.118559112685897, 0.19591682054097215], "isController": false}, {"data": ["Update a cart - patch", 10, 0, 0.0, 394.8, 387, 402, 394.5, 401.9, 402.0, 402.0, 1.075037626316921, 0.851841337884326, 0.44618260857880027], "isController": false}, {"data": ["Limit results", 30, 0, 0.0, 511.63333333333327, 390, 587, 562.0, 575.8, 581.5, 587.0, 1.5759613364152132, 3.3827763842193734, 0.20315126602227357], "isController": false}, {"data": ["Delete a user", 10, 0, 0.0, 567.9, 552, 582, 570.0, 581.2, 582.0, 582.0, 1.0308215647871353, 1.0086750077311617, 0.21240561540047417], "isController": false}, {"data": ["Get a single product", 10, 0, 0.0, 397.6, 387, 406, 396.0, 406.0, 406.0, 406.0, 1.1436413540713632, 1.231201395242452, 0.1429551692589204], "isController": false}, {"data": ["Get products in a specific category", 10, 0, 0.0, 563.6, 556, 575, 562.5, 574.5, 575.0, 575.0, 1.1224604332697272, 2.452093739476933, 0.15784599842855537], "isController": false}, {"data": ["Update a product - patch", 10, 0, 0.0, 420.4, 394, 602, 401.5, 582.7, 602.0, 602.0, 1.146788990825688, 0.9313180905963302, 0.4009281823394495], "isController": false}, {"data": ["Get all carts", 10, 0, 0.0, 573.2, 559, 596, 569.0, 595.6, 596.0, 596.0, 1.050089257586895, 1.6776816654415625, 0.12613376824530084], "isController": false}, {"data": ["Add new product", 10, 0, 0.0, 399.9, 393, 413, 398.0, 412.9, 413.0, 413.0, 1.1453441759248653, 0.9350661436261597, 0.40042306150498225], "isController": false}, {"data": ["Update a cart", 10, 0, 0.0, 415.90000000000003, 389, 601, 392.5, 581.7, 601.0, 601.0, 1.0755001075500108, 0.8513675656055065, 0.444273970208647], "isController": false}, {"data": ["Get all categories", 10, 0, 0.0, 398.1, 388, 408, 398.0, 407.9, 408.0, 408.0, 1.1420740063956143, 0.8487483582686158, 0.15279701062128825], "isController": false}, {"data": ["Update a users - patch", 10, 0, 0.0, 416.7, 389, 613, 394.0, 592.1000000000001, 613.0, 613.0, 1.0479983232026828, 0.9978499659400545, 0.6560223878641794], "isController": false}, {"data": ["Get a single cart", 10, 0, 0.0, 570.0000000000001, 553, 588, 569.0, 587.4, 588.0, 588.0, 1.0506408909434755, 0.8550821469846606, 0.12825206188274846], "isController": false}, {"data": ["Update a users", 10, 0, 0.0, 399.3, 389, 416, 396.0, 415.2, 416.0, 416.0, 1.0723860589812333, 1.0214896112600538, 0.6691940348525469], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 290, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
