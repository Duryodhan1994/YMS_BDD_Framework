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

    var data = {"OkPercent": 96.28205128205128, "KoPercent": 3.717948717948718};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5942528735632184, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.27361111111111114, 500, 1500, "Upload video"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "Yard entry completed"], "isController": false}, {"data": [0.9541666666666667, 500, 1500, "Employee Approval"], "isController": false}, {"data": [0.4708333333333333, 500, 1500, "Yard entry -Uplod Top Image"], "isController": false}, {"data": [0.9833333333333333, 500, 1500, "Token"], "isController": false}, {"data": [0.0, 500, 1500, "YMS Flow with Vehicle is not Working"], "isController": true}, {"data": [0.95, 500, 1500, "Yard Exit Completed"], "isController": false}, {"data": [0.9541666666666667, 500, 1500, "Pre Repo Initiate"], "isController": false}, {"data": [0.975, 500, 1500, "Reset Contract Number"], "isController": false}, {"data": [1.0, 500, 1500, "Search Vehicle details"], "isController": false}, {"data": [0.9375, 500, 1500, "Vehicle release"], "isController": false}, {"data": [0.4930555555555556, 500, 1500, "Upload Tyre Front Left Image"], "isController": false}, {"data": [0.475, 500, 1500, "Upload Tyre Rear Left Image"], "isController": false}, {"data": [0.0, 500, 1500, "YMS Flow with Vehicle is Accidental"], "isController": true}, {"data": [0.975, 500, 1500, "YardToken"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "Initiate Request"], "isController": false}, {"data": [0.9541666666666667, 500, 1500, "sent OTP"], "isController": false}, {"data": [0.9458333333333333, 500, 1500, "Yard Exit Init"], "isController": false}, {"data": [0.9541666666666667, 500, 1500, "Yard init"], "isController": false}, {"data": [0.44166666666666665, 500, 1500, "Upload Front ID Document"], "isController": false}, {"data": [0.0, 500, 1500, "YMS Flow with Vehicle is Loaded with hazardous Material"], "isController": true}, {"data": [0.4583333333333333, 500, 1500, "Upload Inventory Document in Yard Entry"], "isController": false}, {"data": [0.4875, 500, 1500, "Upload Release Document"], "isController": false}, {"data": [0.4875, 500, 1500, "Upload Engine Image"], "isController": false}, {"data": [0.475, 500, 1500, "Uplod Top Image"], "isController": false}, {"data": [1.0, 500, 1500, "RVMToken"], "isController": false}, {"data": [0.47638888888888886, 500, 1500, "Upload Chassis Image"], "isController": false}, {"data": [0.4625, 500, 1500, "Upload Back ID Document"], "isController": false}, {"data": [0.49583333333333335, 500, 1500, "Yard Exit -Uplod Top Image"], "isController": false}, {"data": [0.4708333333333333, 500, 1500, "Uplod Front Image"], "isController": false}, {"data": [0.4736111111111111, 500, 1500, "Upload Interior Image"], "isController": false}, {"data": [0.9958333333333333, 500, 1500, "Search the details"], "isController": false}, {"data": [0.49166666666666664, 500, 1500, "Upload Front Image"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "Repo details submitted"], "isController": false}, {"data": [0.0, 500, 1500, "YMS Flow with Vehicle is Working"], "isController": true}, {"data": [0.4875, 500, 1500, "Upload Left Image"], "isController": false}, {"data": [0.44583333333333336, 500, 1500, "Submitted Repossession"], "isController": false}, {"data": [0.48333333333333334, 500, 1500, "Upload customer satisfaction Document"], "isController": false}, {"data": [0.9875, 500, 1500, "AgencyToken"], "isController": false}, {"data": [0.48333333333333334, 500, 1500, "Uplod Rear Image"], "isController": false}, {"data": [0.45416666666666666, 500, 1500, "Repossession Kit"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "RVMApproval"], "isController": false}, {"data": [0.4875, 500, 1500, "Upload Tyre Rear Right Image"], "isController": false}, {"data": [0.4791666666666667, 500, 1500, "Upload Spare Tyre Image"], "isController": false}, {"data": [1.0, 500, 1500, "Search the details after Employee approval"], "isController": false}, {"data": [0.4861111111111111, 500, 1500, "Upload Rear Image"], "isController": false}, {"data": [0.48055555555555557, 500, 1500, "Upload Right Image"], "isController": false}, {"data": [0.46805555555555556, 500, 1500, "Upload Tyre Front Right Image"], "isController": false}, {"data": [0.9541666666666667, 500, 1500, "Repo Agency Initiate Repossession"], "isController": false}, {"data": [0.4375, 500, 1500, "Upload Inventory Document"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 8580, 319, 3.717948717948718, 721.7122377622375, 48, 7778, 661.0, 1335.800000000001, 1606.8999999999996, 2353.1900000000005, 1.3845724099902872, 2.363251342585413, 556.2724721016425], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Upload video", 360, 15, 4.166666666666667, 1541.2027777777785, 722, 5753, 1432.0, 2248.9, 2586.5999999999995, 3382.909999999996, 0.058249948262719564, 0.041066497948792795, 60.189523165569575], "isController": false}, {"data": ["Yard entry completed", 120, 5, 4.166666666666667, 132.96666666666658, 54, 1162, 90.5, 204.6000000000003, 510.4499999999999, 1049.2299999999957, 0.01950720571795214, 0.011530015879678253, 0.03529966034703644], "isController": false}, {"data": ["Employee Approval", 120, 5, 4.166666666666667, 116.04166666666669, 50, 1663, 89.5, 117.9, 134.95, 1503.819999999994, 0.019502789386452, 0.01190038369300269, 0.03881512184530192], "isController": false}, {"data": ["Yard entry -Uplod Top Image", 120, 5, 4.166666666666667, 968.3666666666668, 361, 2463, 943.5, 1427.0, 1649.5499999999997, 2398.3199999999974, 0.019501153980786813, 0.013691117789082668, 10.617460417126434], "isController": false}, {"data": ["Token", 120, 0, 0.0, 128.29166666666669, 51, 5468, 55.0, 125.70000000000002, 290.4499999999999, 4495.279999999963, 0.01950288130692708, 0.06405096663593338, 0.007142168447360992], "isController": false}, {"data": ["YMS Flow with Vehicle is not Working", 30, 2, 6.666666666666667, 51712.73333333334, 31857, 67699, 51888.0, 61546.700000000004, 66646.3, 67699.0, 0.004963630650948724, 0.5935776779966224, 142.5833471530807], "isController": true}, {"data": ["Yard Exit Completed", 120, 5, 4.166666666666667, 85.18333333333332, 49, 1161, 54.0, 74.80000000000001, 275.44999999999806, 1159.53, 0.019528027112712842, 0.01152325232700853, 0.03507035337917863], "isController": false}, {"data": ["Pre Repo Initiate", 120, 5, 4.166666666666667, 103.89166666666667, 50, 1197, 81.0, 99.9, 298.099999999998, 1037.609999999994, 0.019502985907142386, 0.011698934661584188, 0.045529187315452996], "isController": false}, {"data": ["Reset Contract Number", 120, 0, 0.0, 131.27500000000003, 50, 635, 97.0, 172.0000000000001, 543.0499999999988, 632.2699999999999, 0.019500494825056187, 0.011311810474690796, 0.03774412181959117], "isController": false}, {"data": ["Search Vehicle details", 120, 0, 0.0, 71.40000000000002, 54, 411, 59.0, 69.0, 87.59999999999991, 406.3799999999998, 0.019502339305599706, 0.02636497888546731, 0.03774769189814318], "isController": false}, {"data": ["Vehicle release", 120, 7, 5.833333333333333, 69.00833333333333, 49, 521, 54.0, 76.9, 80.94999999999999, 500.20999999999924, 0.0195086137845589, 0.01165579344255339, 0.039169638614309665], "isController": false}, {"data": ["Upload Tyre Front Left Image", 360, 15, 4.166666666666667, 885.1944444444442, 351, 4198, 867.5, 1349.4, 1541.6499999999999, 2546.7999999999997, 0.058243341977076715, 0.04156300118598005, 31.711452563012422], "isController": false}, {"data": ["Upload Tyre Rear Left Image", 360, 15, 4.166666666666667, 900.3472222222235, 303, 2355, 902.5, 1336.5000000000002, 1600.8999999999996, 2175.6299999999997, 0.05825253087020058, 0.04151504153162732, 31.71641197879762], "isController": false}, {"data": ["YMS Flow with Vehicle is Accidental", 30, 2, 6.666666666666667, 51156.86666666667, 27145, 63815, 53701.5, 61616.8, 63505.35, 63815.0, 0.004957653377401364, 0.6122797136438752, 142.42340667604833], "isController": true}, {"data": ["YardToken", 120, 0, 0.0, 134.72500000000002, 55, 1609, 70.0, 165.9, 386.7999999999988, 1470.8199999999947, 0.019504811837080208, 0.062304921405360696, 0.007066684757379645], "isController": false}, {"data": ["Initiate Request", 120, 5, 4.166666666666667, 82.39166666666662, 61, 416, 69.0, 79.80000000000001, 114.99999999999977, 415.58, 0.019502355153164185, 0.011254166698493428, 0.03780485837795987], "isController": false}, {"data": ["sent OTP", 120, 5, 4.166666666666667, 69.4, 49, 1205, 54.0, 66.80000000000001, 87.94999999999999, 1035.5299999999936, 0.019514222697285134, 0.011719173697478486, 0.03512178948349268], "isController": false}, {"data": ["Yard Exit Init", 120, 5, 4.166666666666667, 89.98333333333335, 48, 1457, 53.0, 74.60000000000002, 134.39999999999964, 1392.9499999999975, 0.01951760927502816, 0.011897514019742712, 0.04376213954635221], "isController": false}, {"data": ["Yard init", 120, 5, 4.166666666666667, 72.10833333333335, 50, 893, 55.0, 67.9, 97.19999999999982, 791.3599999999961, 0.01950378787940353, 0.01145180904540173, 0.05081650982641466], "isController": false}, {"data": ["Upload Front ID Document", 120, 5, 4.166666666666667, 945.666666666667, 350, 3929, 843.5, 1569.5000000000007, 1935.5999999999972, 3662.5099999999898, 0.01950706619088932, 0.011723607081682751, 10.618055693984605], "isController": false}, {"data": ["YMS Flow with Vehicle is Loaded with hazardous Material", 30, 1, 3.3333333333333335, 52233.23333333333, 36040, 69000, 52233.5, 60025.700000000004, 67242.2, 69000.0, 0.004961919746902398, 0.6128864097587234, 142.53421782498964], "isController": true}, {"data": ["Upload Inventory Document in Yard Entry", 120, 5, 4.166666666666667, 973.5833333333336, 413, 3895, 921.0, 1508.7000000000005, 1742.2499999999986, 3819.189999999997, 0.019503955889853358, 0.01172173781303443, 10.61936114731533], "isController": false}, {"data": ["Upload Release Document", 120, 5, 4.166666666666667, 901.9250000000002, 295, 3249, 872.5, 1396.0000000000002, 1609.499999999999, 3242.0699999999997, 0.019510811916423485, 0.011725858235903927, 10.620093132421832], "isController": false}, {"data": ["Upload Engine Image", 360, 15, 4.166666666666667, 889.1611111111117, 352, 3637, 918.5, 1318.4, 1505.6999999999998, 2102.059999999995, 0.05824528318371307, 0.041073795074973, 31.712048278504028], "isController": false}, {"data": ["Uplod Top Image", 120, 5, 4.166666666666667, 884.4833333333335, 344, 2162, 854.0, 1377.0000000000002, 1625.4499999999996, 2107.819999999998, 0.019497304253970588, 0.013724909000394333, 10.61539203057031], "isController": false}, {"data": ["RVMToken", 30, 0, 0.0, 68.16666666666666, 52, 382, 54.0, 79.50000000000003, 226.8999999999998, 382.0, 0.005006739906370626, 0.01651637441769529, 0.0018335229149306492], "isController": false}, {"data": ["Upload Chassis Image", 360, 15, 4.166666666666667, 929.4055555555556, 339, 7175, 885.0, 1427.9, 1694.9999999999993, 3088.6099999999988, 0.05823915845710233, 0.041123980420399366, 31.708770028861142], "isController": false}, {"data": ["Upload Back ID Document", 120, 5, 4.166666666666667, 967.5749999999997, 334, 2924, 924.0, 1395.7, 2013.3499999999997, 2862.8899999999976, 0.01950839177857845, 0.011724403750390779, 10.618767710215927], "isController": false}, {"data": ["Yard Exit -Uplod Top Image", 120, 5, 4.166666666666667, 856.1333333333334, 278, 2294, 841.0, 1323.3, 1384.6999999999998, 2166.7399999999952, 0.019515133498149477, 0.013682668672957914, 10.625052072118908], "isController": false}, {"data": ["Uplod Front Image", 120, 5, 4.166666666666667, 862.6749999999998, 376, 2059, 798.5, 1331.0000000000005, 1677.4999999999986, 2052.7, 0.019500409264839445, 0.01383659410645631, 10.617189210094486], "isController": false}, {"data": ["Upload Interior Image", 360, 15, 4.166666666666667, 910.7833333333336, 328, 3175, 895.5, 1351.1000000000006, 1638.0, 2510.959999999991, 0.058244774311207004, 0.04118245557784317, 31.71187549872088], "isController": false}, {"data": ["Search the details", 120, 0, 0.0, 95.16666666666666, 71, 548, 76.5, 97.80000000000001, 278.94999999999953, 520.6999999999989, 0.019502393187424014, 0.05098793410295736, 0.03818583822342299], "isController": false}, {"data": ["Upload Front Image", 360, 15, 4.166666666666667, 917.3500000000004, 367, 6491, 883.5, 1331.8000000000002, 1776.1499999999996, 2874.2499999999964, 0.058237537975727886, 0.04101383035364745, 31.707741771976178], "isController": false}, {"data": ["Repo details submitted", 120, 5, 4.166666666666667, 62.23333333333334, 50, 289, 54.0, 85.9, 97.79999999999995, 262.539999999999, 0.01950229493255619, 0.011935791751325586, 0.05465975239886353], "isController": false}, {"data": ["YMS Flow with Vehicle is Working", 30, 2, 6.666666666666667, 51306.866666666676, 37576, 64937, 51387.0, 61630.700000000004, 64895.2, 64937.0, 0.004969181138578536, 0.6040165844557057, 142.74227588154514], "isController": true}, {"data": ["Upload Left Image", 360, 15, 4.166666666666667, 879.2277777777772, 350, 2597, 861.5, 1331.0, 1512.7999999999997, 2134.3599999999997, 0.05824231488610473, 0.040962687121637295, 31.710301350590747], "isController": false}, {"data": ["Submitted Repossession", 120, 5, 4.166666666666667, 1080.1, 49, 2149, 1176.5, 1433.9, 1732.6999999999975, 2110.7799999999984, 0.019502862288826663, 0.011936138984628981, 0.04131026201607913], "isController": false}, {"data": ["Upload customer satisfaction Document", 120, 5, 4.166666666666667, 870.2083333333335, 397, 2040, 852.0, 1276.9, 1586.9999999999986, 2018.999999999999, 0.019513096214524378, 0.011727231082703656, 10.62159472333763], "isController": false}, {"data": ["AgencyToken", 240, 0, 0.0, 106.84999999999998, 52, 1247, 61.0, 158.8, 385.69999999999993, 822.2500000000002, 0.03897578775345021, 0.13082010010606288, 0.014235297480264041], "isController": false}, {"data": ["Uplod Rear Image", 120, 5, 4.166666666666667, 941.2249999999997, 384, 4107, 898.5, 1389.5, 1657.1499999999999, 3913.379999999993, 0.019501353637709377, 0.013819013411487176, 10.617685291095894], "isController": false}, {"data": ["Repossession Kit", 120, 5, 4.166666666666667, 1093.6666666666672, 49, 3743, 1095.0, 1384.4, 1515.6499999999992, 3405.319999999987, 0.019500120900749585, 1.1422108536799491, 0.039685792926916146], "isController": false}, {"data": ["RVMApproval", 30, 2, 6.666666666666667, 99.33333333333334, 50, 532, 86.0, 93.80000000000001, 293.8499999999997, 532.0, 0.005006716510198431, 0.0030516197896144344, 0.010057437364724779], "isController": false}, {"data": ["Upload Tyre Rear Right Image", 360, 15, 4.166666666666667, 916.4722222222225, 309, 7778, 908.5, 1346.7, 1534.95, 2274.109999999999, 0.058249203684844625, 0.041567184156232784, 31.71468387565567], "isController": false}, {"data": ["Upload Spare Tyre Image", 360, 15, 4.166666666666667, 926.2250000000004, 381, 3454, 877.5, 1378.0000000000005, 1658.8999999999996, 2959.139999999993, 0.05825270996461148, 0.041297100754534403, 31.71628573212127], "isController": false}, {"data": ["Search the details after Employee approval", 120, 0, 0.0, 96.69166666666666, 79, 390, 85.0, 103.9, 132.39999999999986, 387.26999999999987, 0.019502897155372432, 0.055274238820207995, 0.036948848126389176], "isController": false}, {"data": ["Upload Rear Image", 360, 15, 4.166666666666667, 922.2333333333337, 341, 3239, 920.0, 1422.0000000000005, 1636.85, 2424.9799999999977, 0.05823691618704792, 0.04095889013621938, 31.707336411188056], "isController": false}, {"data": ["Upload Right Image", 360, 15, 4.166666666666667, 899.0833333333331, 342, 2594, 895.0, 1403.7, 1536.0, 1943.78, 0.05824116534100607, 0.04101638492839977, 31.709731403575685], "isController": false}, {"data": ["Upload Tyre Front Right Image", 360, 15, 4.166666666666667, 947.3416666666662, 355, 3864, 921.0, 1438.4, 1739.3999999999999, 2785.959999999999, 0.05824168357293315, 0.04161632451699848, 31.710645836568983], "isController": false}, {"data": ["Repo Agency Initiate Repossession", 120, 5, 4.166666666666667, 68.59999999999998, 49, 592, 62.0, 72.70000000000002, 92.74999999999994, 493.7199999999963, 0.019502989076863396, 0.011552918090046275, 0.038606014510548924], "isController": false}, {"data": ["Upload Inventory Document", 120, 5, 4.166666666666667, 999.7999999999998, 371, 2357, 1023.5, 1457.1000000000006, 1616.95, 2356.16, 0.019503432847974154, 0.011712693904754662, 10.619131123742699], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400", 250, 78.36990595611286, 2.913752913752914], "isController": false}, {"data": ["500", 37, 11.598746081504702, 0.43123543123543123], "isController": false}, {"data": ["404", 32, 10.031347962382446, 0.372960372960373], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 8580, 319, "400", 250, "500", 37, "404", 32, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Upload video", 360, 15, "400", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Yard entry completed", 120, 5, "500", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Employee Approval", 120, 5, "404", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Yard entry -Uplod Top Image", 120, 5, "400", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Yard Exit Completed", 120, 5, "500", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Pre Repo Initiate", 120, 5, "404", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Vehicle release", 120, 7, "500", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Upload Tyre Front Left Image", 360, 15, "400", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Upload Tyre Rear Left Image", 360, 15, "400", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Initiate Request", 120, 5, "500", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["sent OTP", 120, 5, "500", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Yard Exit Init", 120, 5, "500", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Yard init", 120, 5, "500", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Upload Front ID Document", 120, 5, "400", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Upload Inventory Document in Yard Entry", 120, 5, "400", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Upload Release Document", 120, 5, "400", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Upload Engine Image", 360, 15, "400", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Uplod Top Image", 120, 5, "400", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Upload Chassis Image", 360, 15, "400", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Upload Back ID Document", 120, 5, "400", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Yard Exit -Uplod Top Image", 120, 5, "400", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Uplod Front Image", 120, 5, "400", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Upload Interior Image", 360, 15, "400", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Upload Front Image", 360, 15, "400", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Repo details submitted", 120, 5, "404", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Upload Left Image", 360, 15, "400", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Submitted Repossession", 120, 5, "404", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Upload customer satisfaction Document", 120, 5, "400", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Uplod Rear Image", 120, 5, "400", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Repossession Kit", 120, 5, "404", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["RVMApproval", 30, 2, "404", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Upload Tyre Rear Right Image", 360, 15, "400", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Upload Spare Tyre Image", 360, 15, "400", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Upload Rear Image", 360, 15, "400", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Upload Right Image", 360, 15, "400", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Upload Tyre Front Right Image", 360, 15, "400", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Repo Agency Initiate Repossession", 120, 5, "404", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Upload Inventory Document", 120, 5, "400", 5, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
