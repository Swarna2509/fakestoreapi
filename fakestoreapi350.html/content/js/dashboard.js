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

    var data = {"OkPercent": 98.23645320197045, "KoPercent": 1.7635467980295567};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.397192118226601, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.22, 500, 1500, "Delete a product"], "isController": false}, {"data": [0.2571428571428571, 500, 1500, "Get carts in a date range"], "isController": false}, {"data": [0.29285714285714287, 500, 1500, "Get a single user"], "isController": false}, {"data": [0.2885714285714286, 500, 1500, "Delete a cart"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "Update a product"], "isController": false}, {"data": [0.6585714285714286, 500, 1500, "Add a new cart"], "isController": false}, {"data": [0.3657142857142857, 500, 1500, "User login"], "isController": false}, {"data": [0.0, 500, 1500, "Get all products"], "isController": false}, {"data": [0.28, 500, 1500, "Get all users"], "isController": false}, {"data": [0.2985714285714286, 500, 1500, "Add a new user"], "isController": false}, {"data": [0.28, 500, 1500, "Get user carts"], "isController": false}, {"data": [0.28095238095238095, 500, 1500, "Sort results"], "isController": false}, {"data": [0.6757142857142857, 500, 1500, "Update a cart - patch"], "isController": false}, {"data": [0.3742857142857143, 500, 1500, "Limit results"], "isController": false}, {"data": [0.34, 500, 1500, "Delete a user"], "isController": false}, {"data": [0.3314285714285714, 500, 1500, "Get a single product"], "isController": false}, {"data": [0.29, 500, 1500, "Get products in a specific category"], "isController": false}, {"data": [0.6685714285714286, 500, 1500, "Update a product - patch"], "isController": false}, {"data": [0.24571428571428572, 500, 1500, "Get all carts"], "isController": false}, {"data": [0.5728571428571428, 500, 1500, "Add new product"], "isController": false}, {"data": [0.7071428571428572, 500, 1500, "Update a cart"], "isController": false}, {"data": [0.6014285714285714, 500, 1500, "Get all categories"], "isController": false}, {"data": [0.6528571428571428, 500, 1500, "Update a users - patch"], "isController": false}, {"data": [0.2671428571428571, 500, 1500, "Get a single cart"], "isController": false}, {"data": [0.6514285714285715, 500, 1500, "Update a users"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 10150, 179, 1.7635467980295567, 33551.59990147784, 380, 3774562, 1117.0, 6546.899999999996, 16308.949999999923, 143604.91999999929, 2.6277956574317556, 5.128503657425543, 0.6376530626246423], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Delete a product", 350, 0, 0.0, 2519.162857142856, 547, 74013, 1641.0, 2962.9, 5526.999999999997, 39075.05000000005, 0.09205874926353001, 0.09907463284998105, 0.01923884017812053], "isController": false}, {"data": ["Get carts in a date range", 350, 1, 0.2857142857142857, 2936.548571428571, 557, 55699, 1479.5, 5605.800000000004, 9199.899999999996, 32008.870000000104, 0.09196380830012782, 0.14745360015318543, 0.0145969452086199], "isController": false}, {"data": ["Get a single user", 350, 1, 0.2857142857142857, 13073.405714285718, 548, 3709002, 1361.0, 4741.20000000001, 9408.8, 29442.170000000053, 0.09197161388109175, 0.08941211366666649, 0.011194926494315366], "isController": false}, {"data": ["Delete a cart", 350, 0, 0.0, 2700.9942857142846, 544, 159743, 1352.0, 3860.20000000001, 6795.549999999999, 34184.09000000022, 0.09200698517031412, 0.07493280943460656, 0.01895847057708621], "isController": false}, {"data": ["Update a product", 350, 0, 0.0, 1435.8000000000006, 388, 109676, 629.5, 1960.3000000000002, 3234.5499999999984, 13846.15000000003, 0.09207386112525834, 0.07484084046598845, 0.03201005328182809], "isController": false}, {"data": ["Add a new cart", 350, 0, 0.0, 1632.6885714285713, 380, 65063, 523.5, 2371.3, 4703.149999999998, 31844.220000000056, 0.09200577585973482, 0.07295257082538907, 0.03791644278594541], "isController": false}, {"data": ["User login", 350, 0, 0.0, 1576.7771428571443, 546, 26284, 945.0, 2458.800000000003, 2904.249999999998, 15106.570000000003, 0.09193230945255886, 0.07649465847015707, 0.022713744425290422], "isController": false}, {"data": ["Get all products", 350, 95, 27.142857142857142, 863030.571428571, 1546, 3774562, 21888.0, 3770850.5, 3772057.15, 3774560.49, 0.09272594132726322, 0.8263839897303371, 0.008312735755705824], "isController": false}, {"data": ["Get all users", 350, 0, 0.0, 4481.154285714289, 557, 116936, 1369.0, 6574.500000000004, 18233.849999999995, 69313.80000000003, 0.09198887302591878, 0.33168456693478354, 0.01104944470916798], "isController": false}, {"data": ["Add a new user", 350, 0, 0.0, 1895.648571428572, 545, 45343, 1356.0, 2678.200000000002, 4511.299999999999, 15271.630000000012, 0.09212684023363367, 0.063511996888745, 0.05739933991118972], "isController": false}, {"data": ["Get user carts", 350, 0, 0.0, 3630.357142857142, 559, 98216, 1427.0, 5556.800000000004, 13448.149999999998, 54407.61000000017, 0.091957453650816, 0.0749124827776826, 0.01167428610801375], "isController": false}, {"data": ["Sort results", 1050, 2, 0.19047619047619047, 8271.53523809524, 407, 3708969, 1437.0, 14045.0, 14881.45, 74898.23000000004, 0.27372705189708485, 1.4820988394005585, 0.035751268252380515], "isController": false}, {"data": ["Update a cart - patch", 350, 0, 0.0, 1670.565714285714, 383, 49177, 497.5, 2667.200000000005, 6429.749999999997, 33131.240000000034, 0.09201741074574064, 0.07283034283321081, 0.038190819889589625], "isController": false}, {"data": ["Limit results", 1050, 1, 0.09523809523809523, 2818.6638095238104, 381, 148004, 1293.5, 4924.699999999996, 9274.399999999996, 24369.27000000003, 0.2738675576491209, 0.5880009310681878, 0.035269872433143716], "isController": false}, {"data": ["Delete a user", 350, 0, 0.0, 1549.0685714285714, 553, 58507, 1085.5, 2374.8000000000006, 3018.1499999999996, 9239.670000000056, 0.0919248244038872, 0.08986934018856145, 0.018941540966035356], "isController": false}, {"data": ["Get a single product", 350, 79, 22.571428571428573, 19809.591428571413, 389, 3754436, 1356.5, 18427.0, 36257.29999999999, 145372.32, 0.09191540946082684, 0.14235629854610832, 0.008896098558530026], "isController": false}, {"data": ["Get products in a specific category", 350, 0, 0.0, 2482.05142857143, 553, 45342, 1152.5, 4675.500000000001, 7353.499999999999, 30245.010000000013, 0.09192600744338014, 0.2009383511363368, 0.012927094796725333], "isController": false}, {"data": ["Update a product - patch", 350, 0, 0.0, 1558.6628571428573, 383, 108172, 554.0, 1836.0000000000032, 3778.6999999999994, 33081.86000000027, 0.09207931133093804, 0.07482420332979836, 0.032191790484839666], "isController": false}, {"data": ["Get all carts", 350, 0, 0.0, 4222.4000000000015, 552, 142033, 1529.5, 5977.7000000000035, 14227.399999999992, 66504.6400000001, 0.09192146860041422, 0.14700715270493367, 0.011041348279151318], "isController": false}, {"data": ["Add new product", 350, 0, 0.0, 1702.2171428571428, 386, 124258, 721.0, 2264.1000000000017, 4753.049999999999, 15370.150000000001, 0.09207097883288197, 0.07520945325622169, 0.032188877365402095], "isController": false}, {"data": ["Update a cart", 350, 0, 0.0, 1746.102857142857, 381, 81575, 472.5, 2019.7000000000069, 5576.249999999998, 37734.79000000008, 0.0920188622893031, 0.07282943771479831, 0.03801169799646016], "isController": false}, {"data": ["Get all categories", 350, 0, 0.0, 1504.134285714286, 382, 87370, 621.0, 2093.9000000000015, 4153.899999999995, 14386.230000000081, 0.09189738160729045, 0.06833688270559544, 0.012294864531444133], "isController": false}, {"data": ["Update a users - patch", 350, 0, 0.0, 936.5114285714291, 385, 20414, 572.0, 1594.6000000000001, 2200.2999999999984, 6503.220000000003, 0.09189716444735015, 0.08762692065073695, 0.05752547110424946], "isController": false}, {"data": ["Get a single cart", 350, 0, 0.0, 2587.5285714285696, 558, 96703, 1405.0, 4792.5, 7933.599999999993, 17429.33, 0.09194800786759698, 0.07472417567954176, 0.01122412205415002], "isController": false}, {"data": ["Update a users", 350, 0, 0.0, 1043.8571428571431, 383, 28361, 540.5, 1773.3000000000013, 2349.5999999999985, 11908.960000000021, 0.09217199082809686, 0.08785657228430373, 0.05751748255776748], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fakestoreapi.com:443 failed to respond", 5, 2.793296089385475, 0.04926108374384237], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 162, 90.50279329608938, 1.5960591133004927], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3, 1.675977653631285, 0.029556650246305417], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 9, 5.027932960893855, 0.08866995073891626], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 10150, 179, "Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 162, "Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 9, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fakestoreapi.com:443 failed to respond", 5, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["Get carts in a date range", 350, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get a single user", 350, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get all products", 350, 95, "Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 78, "Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 9, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fakestoreapi.com:443 failed to respond", 5, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3, "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Sort results", 1050, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Limit results", 1050, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Get a single product", 350, 79, "Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 79, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
