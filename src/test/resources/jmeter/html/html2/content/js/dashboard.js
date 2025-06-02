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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6458333333333334, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "Uplod Top Image"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "Upload video"], "isController": false}, {"data": [0.5555555555555556, 500, 1500, "Upload Chassis Image"], "isController": false}, {"data": [1.0, 500, 1500, "Yard entry completed"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "Upload Back ID Document"], "isController": false}, {"data": [1.0, 500, 1500, "Employee Approval"], "isController": false}, {"data": [0.5, 500, 1500, "Yard entry -Uplod Top Image"], "isController": false}, {"data": [1.0, 500, 1500, "Token"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "Yard Exit -Uplod Top Image"], "isController": false}, {"data": [0.5, 500, 1500, "Uplod Front Image"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "Upload Interior Image"], "isController": false}, {"data": [1.0, 500, 1500, "Search the details"], "isController": false}, {"data": [0.5555555555555556, 500, 1500, "Upload Front Image"], "isController": false}, {"data": [1.0, 500, 1500, "Yard Exit Completed"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "Pre Repo Initiate"], "isController": false}, {"data": [1.0, 500, 1500, "Reset Contract Number"], "isController": false}, {"data": [1.0, 500, 1500, "Search Vehicle details"], "isController": false}, {"data": [1.0, 500, 1500, "Vehicle release"], "isController": false}, {"data": [1.0, 500, 1500, "Repo details submitted"], "isController": false}, {"data": [0.5555555555555556, 500, 1500, "Upload Tyre Front Left Image"], "isController": false}, {"data": [0.0, 500, 1500, "YMS Flow with Vehicle is Working"], "isController": true}, {"data": [0.5555555555555556, 500, 1500, "Upload Left Image"], "isController": false}, {"data": [0.5, 500, 1500, "Submitted Repossession"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "Upload customer satisfaction Document"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "AgencyToken"], "isController": false}, {"data": [0.5, 500, 1500, "Upload Tyre Rear Left Image"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "Uplod Rear Image"], "isController": false}, {"data": [1.0, 500, 1500, "YardToken"], "isController": false}, {"data": [1.0, 500, 1500, "Initiate Request"], "isController": false}, {"data": [1.0, 500, 1500, "sent OTP"], "isController": false}, {"data": [1.0, 500, 1500, "Yard Exit Init"], "isController": false}, {"data": [0.5, 500, 1500, "Repossession Kit"], "isController": false}, {"data": [1.0, 500, 1500, "Yard init"], "isController": false}, {"data": [0.5, 500, 1500, "Upload Front ID Document"], "isController": false}, {"data": [0.5555555555555556, 500, 1500, "Upload Tyre Rear Right Image"], "isController": false}, {"data": [0.6111111111111112, 500, 1500, "Upload Spare Tyre Image"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "Upload Inventory Document in Yard Entry"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "Upload Release Document"], "isController": false}, {"data": [1.0, 500, 1500, "Search the details after Employee approval"], "isController": false}, {"data": [0.5555555555555556, 500, 1500, "Upload Rear Image"], "isController": false}, {"data": [0.5555555555555556, 500, 1500, "Upload Right Image"], "isController": false}, {"data": [0.4444444444444444, 500, 1500, "Upload Tyre Front Right Image"], "isController": false}, {"data": [1.0, 500, 1500, "Repo Agency Initiate Repossession"], "isController": false}, {"data": [0.5, 500, 1500, "Upload Inventory Document"], "isController": false}, {"data": [0.5, 500, 1500, "Upload Engine Image"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 213, 0, 0.0, 578.8215962441318, 51, 5200, 537.0, 910.6, 1016.5999999999997, 2826.199999999985, 1.724012335186849, 3.000723017790512, 697.5083250749702], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Uplod Top Image", 3, 0, 0.0, 676.3333333333334, 513, 863, 653.0, 863.0, 863.0, 863.0, 0.035138680659670164, 0.02487846042798913, 19.13157038424147], "isController": false}, {"data": ["Upload video", 9, 0, 0.0, 1251.6666666666667, 899, 1947, 1010.0, 1947.0, 1947.0, 1947.0, 0.08465329771624215, 0.05996275254900485, 87.47157464245738], "isController": false}, {"data": ["Upload Chassis Image", 9, 0, 0.0, 658.3333333333334, 492, 910, 570.0, 910.0, 910.0, 910.0, 0.08385900505949331, 0.05956391570306459, 45.65795251250897], "isController": false}, {"data": ["Yard entry completed", 3, 0, 0.0, 101.66666666666667, 97, 108, 100.0, 108.0, 108.0, 108.0, 0.037266617805989985, 0.021981481596501904, 0.06743656522900336], "isController": false}, {"data": ["Upload Back ID Document", 3, 0, 0.0, 754.6666666666666, 498, 899, 867.0, 899.0, 899.0, 899.0, 0.03698863216038271, 0.0222148523228861, 20.13333872108722], "isController": false}, {"data": ["Employee Approval", 3, 0, 0.0, 99.0, 93, 105, 99.0, 105.0, 105.0, 105.0, 0.03546099290780142, 0.02167830230496454, 0.07054105718085107], "isController": false}, {"data": ["Yard entry -Uplod Top Image", 3, 0, 0.0, 579.3333333333334, 502, 690, 546.0, 690.0, 690.0, 690.0, 0.035954840720055614, 0.025386083828711138, 19.575725388911525], "isController": false}, {"data": ["Token", 3, 0, 0.0, 57.0, 51, 66, 54.0, 66.0, 66.0, 66.0, 0.035471894435642165, 0.11701568301132736, 0.012990195716177549], "isController": false}, {"data": ["Yard Exit -Uplod Top Image", 3, 0, 0.0, 601.6666666666666, 467, 827, 511.0, 827.0, 827.0, 827.0, 0.0373055448474825, 0.02630332361316637, 20.31097474725493], "isController": false}, {"data": ["Uplod Front Image", 3, 0, 0.0, 545.3333333333334, 526, 582, 528.0, 582.0, 582.0, 582.0, 0.03443368073091227, 0.02458107481864928, 18.747726839045498], "isController": false}, {"data": ["Upload Interior Image", 9, 0, 0.0, 600.4444444444445, 467, 975, 521.0, 975.0, 975.0, 975.0, 0.08363224115821362, 0.059484520485252844, 45.53416173778505], "isController": false}, {"data": ["Search the details", 3, 0, 0.0, 85.66666666666667, 84, 89, 84.0, 89.0, 89.0, 89.0, 0.03460686600221484, 0.08788026096460871, 0.0677605139984773], "isController": false}, {"data": ["Upload Front Image", 9, 0, 0.0, 589.8888888888888, 498, 843, 556.0, 843.0, 843.0, 843.0, 0.08311937789763386, 0.058876226010823984, 45.2549297294926], "isController": false}, {"data": ["Yard Exit Completed", 3, 0, 0.0, 60.666666666666664, 58, 63, 61.0, 63.0, 63.0, 63.0, 0.03769933523505535, 0.0221999015104867, 0.0677041772434246], "isController": false}, {"data": ["Pre Repo Initiate", 3, 0, 0.0, 1396.6666666666667, 581, 2969, 640.0, 2969.0, 2969.0, 2969.0, 0.03428845736230327, 0.020559680488724814, 0.07738342281668248], "isController": false}, {"data": ["Reset Contract Number", 3, 0, 0.0, 176.33333333333334, 132, 262, 135.0, 262.0, 262.0, 262.0, 0.03452681006801781, 0.0200282472464869, 0.06682825933087043], "isController": false}, {"data": ["Search Vehicle details", 3, 0, 0.0, 67.66666666666667, 62, 76, 65.0, 76.0, 76.0, 76.0, 0.03460686600221484, 0.04678460758697859, 0.06698321134413067], "isController": false}, {"data": ["Vehicle release", 3, 0, 0.0, 61.333333333333336, 57, 68, 59.0, 68.0, 68.0, 68.0, 0.03728977887161129, 0.022213637804377823, 0.07487088414065705], "isController": false}, {"data": ["Repo details submitted", 3, 0, 0.0, 68.0, 60, 77, 67.0, 77.0, 77.0, 77.0, 0.035469378103570585, 0.02171806647552613, 0.09941124527074958], "isController": false}, {"data": ["Upload Tyre Front Left Image", 9, 0, 0.0, 701.2222222222222, 493, 978, 563.0, 978.0, 978.0, 978.0, 0.08477689547008788, 0.06087820032780399, 46.15828751554243], "isController": false}, {"data": ["YMS Flow with Vehicle is Working", 3, 0, 0.0, 41096.333333333336, 35464, 43923, 43902.0, 43923.0, 43923.0, 43923.0, 0.024227153793972285, 2.993962012832316, 695.9367514188027], "isController": true}, {"data": ["Upload Left Image", 9, 0, 0.0, 639.3333333333334, 472, 926, 572.0, 926.0, 926.0, 926.0, 0.08340515443854431, 0.05899720071450416, 45.410196975173065], "isController": false}, {"data": ["Submitted Repossession", 3, 0, 0.0, 820.0, 767, 881, 812.0, 881.0, 881.0, 881.0, 0.03565994674781286, 0.02183475254968619, 0.07553361767188094], "isController": false}, {"data": ["Upload customer satisfaction Document", 3, 0, 0.0, 625.3333333333334, 483, 858, 535.0, 858.0, 858.0, 858.0, 0.03713101058233802, 0.022300362800915897, 20.211815977164427], "isController": false}, {"data": ["AgencyToken", 6, 0, 0.0, 288.3333333333333, 55, 1319, 75.5, 1319.0, 1319.0, 1319.0, 0.06556373888148262, 0.22108553745874948, 0.023946131193041502], "isController": false}, {"data": ["Upload Tyre Rear Left Image", 9, 0, 0.0, 617.3333333333335, 508, 903, 549.0, 903.0, 903.0, 903.0, 0.08508948577587429, 0.061019575899821314, 46.32781810172448], "isController": false}, {"data": ["Uplod Rear Image", 3, 0, 0.0, 739.3333333333334, 473, 885, 860.0, 885.0, 885.0, 885.0, 0.034314342251249616, 0.02446237289395724, 18.682751931611513], "isController": false}, {"data": ["YardToken", 3, 0, 0.0, 102.66666666666667, 60, 158, 90.0, 158.0, 158.0, 158.0, 0.03613325946089177, 0.1159863514140149, 0.01309124927733481], "isController": false}, {"data": ["Initiate Request", 3, 0, 0.0, 82.0, 73, 93, 80.0, 93.0, 93.0, 93.0, 0.03460806367883717, 0.019906396002768646, 0.06708692031493338], "isController": false}, {"data": ["sent OTP", 3, 0, 0.0, 62.666666666666664, 57, 70, 61.0, 70.0, 70.0, 70.0, 0.03732550327220246, 0.02238072168860577, 0.06717861575260657], "isController": false}, {"data": ["Yard Exit Init", 3, 0, 0.0, 69.33333333333333, 58, 91, 59.0, 91.0, 91.0, 91.0, 0.03750187509375469, 0.022852705135256765, 0.08408623556177809], "isController": false}, {"data": ["Repossession Kit", 3, 0, 0.0, 760.6666666666666, 727, 797, 758.0, 797.0, 797.0, 797.0, 0.03420362558431194, 2.0896945544977767, 0.06960972238057235], "isController": false}, {"data": ["Yard init", 3, 0, 0.0, 81.33333333333333, 65, 113, 66.0, 113.0, 113.0, 113.0, 0.036144142841652516, 0.021178208696280766, 0.0941724346694618], "isController": false}, {"data": ["Upload Front ID Document", 3, 0, 0.0, 568.6666666666666, 507, 685, 514.0, 685.0, 685.0, 685.0, 0.037086944159424415, 0.02227389712699806, 20.187249469965757], "isController": false}, {"data": ["Upload Tyre Rear Right Image", 9, 0, 0.0, 619.7777777777778, 447, 874, 584.0, 874.0, 874.0, 874.0, 0.08502357042313397, 0.06105533735463332, 46.29259407799024], "isController": false}, {"data": ["Upload Spare Tyre Image", 9, 0, 0.0, 561.5555555555555, 469, 822, 535.0, 822.0, 822.0, 822.0, 0.08508868131452559, 0.0606866213411867, 46.32702002893015], "isController": false}, {"data": ["Upload Inventory Document in Yard Entry", 3, 0, 0.0, 729.6666666666666, 477, 889, 823.0, 889.0, 889.0, 889.0, 0.03580379520229144, 0.021503255907626206, 19.494187477622628], "isController": false}, {"data": ["Upload Release Document", 3, 0, 0.0, 676.3333333333334, 463, 929, 637.0, 929.0, 929.0, 929.0, 0.03692534925226167, 0.0221768454981845, 20.098929164871684], "isController": false}, {"data": ["Search the details after Employee approval", 3, 0, 0.0, 93.0, 88, 97, 94.0, 97.0, 97.0, 97.0, 0.03546602354943964, 0.09465687730529154, 0.06715685513902682], "isController": false}, {"data": ["Upload Rear Image", 9, 0, 0.0, 677.3333333333334, 482, 1032, 576.0, 1032.0, 1032.0, 1032.0, 0.08356158024232858, 0.05910784956594402, 45.495581101155935], "isController": false}, {"data": ["Upload Right Image", 9, 0, 0.0, 1195.2222222222222, 493, 5200, 813.0, 5200.0, 5200.0, 5200.0, 0.0834592950471545, 0.0591170006584011, 45.44002717933084], "isController": false}, {"data": ["Upload Tyre Front Right Image", 9, 0, 0.0, 813.2222222222222, 527, 1949, 617.0, 1949.0, 1949.0, 1949.0, 0.08362990977261957, 0.060136220926991085, 45.53324630111878], "isController": false}, {"data": ["Repo Agency Initiate Repossession", 3, 0, 0.0, 72.33333333333333, 67, 78, 72.0, 78.0, 78.0, 78.0, 0.0354643465103083, 0.02098768943871761, 0.07020139685194818], "isController": false}, {"data": ["Upload Inventory Document", 3, 0, 0.0, 583.6666666666666, 541, 655, 555.0, 655.0, 655.0, 655.0, 0.03575557489005161, 0.021474295466193102, 19.46803758879301], "isController": false}, {"data": ["Upload Engine Image", 9, 0, 0.0, 781.7777777777778, 520, 1469, 819.0, 1469.0, 1469.0, 1469.0, 0.08362291639566646, 0.05931456211788973, 45.52916646825581], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 213, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
