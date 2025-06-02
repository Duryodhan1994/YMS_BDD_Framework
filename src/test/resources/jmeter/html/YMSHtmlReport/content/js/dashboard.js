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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5856481481481481, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3333333333333333, 500, 1500, "Uplod Top Image"], "isController": false}, {"data": [0.2777777777777778, 500, 1500, "Upload video"], "isController": false}, {"data": [0.3888888888888889, 500, 1500, "Upload Chassis Image"], "isController": false}, {"data": [1.0, 500, 1500, "Yard entry completed"], "isController": false}, {"data": [0.5, 500, 1500, "Upload Back ID Document"], "isController": false}, {"data": [1.0, 500, 1500, "Employee Approval"], "isController": false}, {"data": [0.5, 500, 1500, "Yard entry -Uplod Top Image"], "isController": false}, {"data": [1.0, 500, 1500, "Token"], "isController": false}, {"data": [0.5, 500, 1500, "Yard Exit -Uplod Top Image"], "isController": false}, {"data": [0.5, 500, 1500, "Uplod Front Image"], "isController": false}, {"data": [0.4444444444444444, 500, 1500, "Upload Interior Image"], "isController": false}, {"data": [1.0, 500, 1500, "Search the details"], "isController": false}, {"data": [0.5555555555555556, 500, 1500, "Upload Front Image"], "isController": false}, {"data": [1.0, 500, 1500, "Yard Exit Completed"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "Pre Repo Initiate"], "isController": false}, {"data": [1.0, 500, 1500, "Reset Contract Number"], "isController": false}, {"data": [1.0, 500, 1500, "Search Vehicle details"], "isController": false}, {"data": [1.0, 500, 1500, "Vehicle release"], "isController": false}, {"data": [1.0, 500, 1500, "Repo details submitted"], "isController": false}, {"data": [0.5, 500, 1500, "Upload Tyre Front Left Image"], "isController": false}, {"data": [0.0, 500, 1500, "YMS Flow with Vehicle is Working"], "isController": true}, {"data": [0.4444444444444444, 500, 1500, "Upload Left Image"], "isController": false}, {"data": [0.5, 500, 1500, "Submitted Repossession"], "isController": false}, {"data": [0.5, 500, 1500, "Upload customer satisfaction Document"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "AgencyToken"], "isController": false}, {"data": [0.4444444444444444, 500, 1500, "Upload Tyre Rear Left Image"], "isController": false}, {"data": [0.5, 500, 1500, "Uplod Rear Image"], "isController": false}, {"data": [1.0, 500, 1500, "YardToken"], "isController": false}, {"data": [1.0, 500, 1500, "Initiate Request"], "isController": false}, {"data": [1.0, 500, 1500, "sent OTP"], "isController": false}, {"data": [1.0, 500, 1500, "Yard Exit Init"], "isController": false}, {"data": [0.5, 500, 1500, "Repossession Kit"], "isController": false}, {"data": [1.0, 500, 1500, "Yard init"], "isController": false}, {"data": [0.5, 500, 1500, "Upload Front ID Document"], "isController": false}, {"data": [0.5555555555555556, 500, 1500, "Upload Tyre Rear Right Image"], "isController": false}, {"data": [0.4444444444444444, 500, 1500, "Upload Spare Tyre Image"], "isController": false}, {"data": [0.5, 500, 1500, "Upload Inventory Document in Yard Entry"], "isController": false}, {"data": [0.5, 500, 1500, "Upload Release Document"], "isController": false}, {"data": [1.0, 500, 1500, "Search the details after Employee approval"], "isController": false}, {"data": [0.5, 500, 1500, "Upload Rear Image"], "isController": false}, {"data": [0.4444444444444444, 500, 1500, "Upload Right Image"], "isController": false}, {"data": [0.3888888888888889, 500, 1500, "Upload Tyre Front Right Image"], "isController": false}, {"data": [1.0, 500, 1500, "Repo Agency Initiate Repossession"], "isController": false}, {"data": [0.5, 500, 1500, "Upload Inventory Document"], "isController": false}, {"data": [0.5, 500, 1500, "Upload Engine Image"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 213, 0, 0.0, 699.5164319248832, 54, 3556, 623.0, 1332.1999999999998, 1731.7999999999993, 3005.259999999998, 1.4279010524904472, 2.484123085238319, 577.7062702684019], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Uplod Top Image", 3, 0, 0.0, 1027.0, 639, 1757, 685.0, 1757.0, 1757.0, 1757.0, 0.031939017768740224, 0.022613074103844392, 17.389110890938902], "isController": false}, {"data": ["Upload video", 9, 0, 0.0, 1586.888888888889, 951, 2675, 1464.0, 2675.0, 2675.0, 2675.0, 0.06851087800496322, 0.048528538586848954, 70.79178622369943], "isController": false}, {"data": ["Upload Chassis Image", 9, 0, 0.0, 1140.3333333333335, 510, 2358, 784.0, 2358.0, 2358.0, 2358.0, 0.06874059590458806, 0.04882551440879269, 37.42652453752855], "isController": false}, {"data": ["Yard entry completed", 3, 0, 0.0, 118.0, 109, 126, 119.0, 126.0, 126.0, 126.0, 0.03164156435894191, 0.01866357897734464, 0.05725763550499937], "isController": false}, {"data": ["Upload Back ID Document", 3, 0, 0.0, 655.6666666666666, 583, 775, 609.0, 775.0, 775.0, 775.0, 0.03145445395067942, 0.018891102714519374, 17.121236769470308], "isController": false}, {"data": ["Employee Approval", 3, 0, 0.0, 114.66666666666667, 106, 124, 114.0, 124.0, 124.0, 124.0, 0.03241701244813278, 0.019817431438018673, 0.06448579527035789], "isController": false}, {"data": ["Yard entry -Uplod Top Image", 3, 0, 0.0, 539.6666666666666, 512, 561, 546.0, 561.0, 561.0, 561.0, 0.03135975915704967, 0.02214170495170597, 17.073643249419845], "isController": false}, {"data": ["Token", 3, 0, 0.0, 60.333333333333336, 54, 72, 55.0, 72.0, 72.0, 72.0, 0.03242857606122515, 0.10646960226351461, 0.01187569924117132], "isController": false}, {"data": ["Yard Exit -Uplod Top Image", 3, 0, 0.0, 749.3333333333334, 577, 1048, 623.0, 1048.0, 1048.0, 1048.0, 0.031228530385360068, 0.0220185536506152, 17.002440460855038], "isController": false}, {"data": ["Uplod Front Image", 3, 0, 0.0, 770.6666666666666, 647, 946, 719.0, 946.0, 946.0, 946.0, 0.031480198954857395, 0.022472681089844487, 17.13943121183026], "isController": false}, {"data": ["Upload Interior Image", 9, 0, 0.0, 908.6666666666666, 544, 2884, 592.0, 2884.0, 2884.0, 2884.0, 0.06911327666044646, 0.049157717937199065, 37.629164434883776], "isController": false}, {"data": ["Search the details", 3, 0, 0.0, 116.0, 97, 152, 99.0, 152.0, 152.0, 152.0, 0.031662269129287594, 0.08040278693931398, 0.06199497031662269], "isController": false}, {"data": ["Upload Front Image", 9, 0, 0.0, 815.5555555555555, 495, 1239, 848.0, 1239.0, 1239.0, 1239.0, 0.07166403898523721, 0.05076202761454302, 39.01782661632268], "isController": false}, {"data": ["Yard Exit Completed", 3, 0, 0.0, 72.33333333333333, 67, 77, 73.0, 77.0, 77.0, 77.0, 0.02971032433770735, 0.01749543513245853, 0.05335672505570686], "isController": false}, {"data": ["Pre Repo Initiate", 3, 0, 0.0, 1651.6666666666667, 720, 3025, 1210.0, 3025.0, 3025.0, 3025.0, 0.031419205513023254, 0.01883925018066043, 0.07090799212948902], "isController": false}, {"data": ["Reset Contract Number", 3, 0, 0.0, 194.0, 159, 259, 164.0, 259.0, 259.0, 259.0, 0.0315000315000315, 0.01827247920997921, 0.06096978753228753], "isController": false}, {"data": ["Search Vehicle details", 3, 0, 0.0, 196.33333333333334, 72, 443, 74.0, 443.0, 443.0, 443.0, 0.03156133946324682, 0.04266739674181772, 0.061088451968901565], "isController": false}, {"data": ["Vehicle release", 3, 0, 0.0, 79.33333333333333, 68, 93, 77.0, 93.0, 93.0, 93.0, 0.03165859372526673, 0.01885912321524678, 0.0635645202140121], "isController": false}, {"data": ["Repo details submitted", 3, 0, 0.0, 143.33333333333334, 64, 299, 67.0, 299.0, 299.0, 299.0, 0.03244225279003374, 0.019864543456397613, 0.09092701709706723], "isController": false}, {"data": ["Upload Tyre Front Left Image", 9, 0, 0.0, 823.4444444444445, 532, 1314, 734.0, 1314.0, 1314.0, 1314.0, 0.06839165621794141, 0.04911197708879517, 37.23683015359626], "isController": false}, {"data": ["YMS Flow with Vehicle is Working", 3, 0, 0.0, 49665.666666666664, 47178, 53615, 48204.0, 53615.0, 53615.0, 53615.0, 0.020104274168688263, 2.4832574327176955, 577.50495460413], "isController": true}, {"data": ["Upload Left Image", 9, 0, 0.0, 814.0, 518, 1602, 645.0, 1602.0, 1602.0, 1602.0, 0.0713210238529202, 0.050449409125128776, 38.83097753140106], "isController": false}, {"data": ["Submitted Repossession", 3, 0, 0.0, 809.3333333333334, 772, 865, 791.0, 865.0, 865.0, 865.0, 0.03129498654315578, 0.01916206695562371, 0.0662879158321337], "isController": false}, {"data": ["Upload customer satisfaction Document", 3, 0, 0.0, 573.0, 516, 625, 578.0, 625.0, 625.0, 625.0, 0.03137353328731882, 0.01884250290205183, 17.07764973999184], "isController": false}, {"data": ["AgencyToken", 6, 0, 0.0, 216.66666666666666, 54, 568, 62.5, 568.0, 568.0, 568.0, 0.060262745570688205, 0.20226860988911657, 0.022010026214294324], "isController": false}, {"data": ["Upload Tyre Rear Left Image", 9, 0, 0.0, 777.5555555555557, 520, 1823, 663.0, 1823.0, 1823.0, 1823.0, 0.06849992769452076, 0.049122832262704835, 37.296136901386745], "isController": false}, {"data": ["Uplod Rear Image", 3, 0, 0.0, 698.0, 591, 867, 636.0, 867.0, 867.0, 867.0, 0.03143204392104271, 0.022407609435899586, 17.113458710081304], "isController": false}, {"data": ["YardToken", 3, 0, 0.0, 95.66666666666667, 60, 160, 67.0, 160.0, 160.0, 160.0, 0.03150333935397152, 0.10063224904964926, 0.011413807519847104], "isController": false}, {"data": ["Initiate Request", 3, 0, 0.0, 94.33333333333333, 87, 104, 92.0, 104.0, 104.0, 104.0, 0.031678317247787795, 0.01822121958881544, 0.06140767552427615], "isController": false}, {"data": ["sent OTP", 3, 0, 0.0, 75.66666666666667, 66, 90, 71.0, 90.0, 90.0, 90.0, 0.0315560277272297, 0.018921290063006867, 0.056794686622347976], "isController": false}, {"data": ["Yard Exit Init", 3, 0, 0.0, 76.33333333333333, 65, 94, 70.0, 94.0, 94.0, 94.0, 0.03154142966786874, 0.019220558703857516, 0.07072179933342446], "isController": false}, {"data": ["Repossession Kit", 3, 0, 0.0, 891.0, 726, 996, 951.0, 996.0, 996.0, 996.0, 0.03132832080200501, 1.9141073712928152, 0.06375802788220551], "isController": false}, {"data": ["Yard init", 3, 0, 0.0, 69.33333333333333, 66, 75, 67.0, 75.0, 75.0, 75.0, 0.03150367017757569, 0.018459181744673255, 0.0820818281579804], "isController": false}, {"data": ["Upload Front ID Document", 3, 0, 0.0, 855.3333333333334, 573, 1340, 653.0, 1340.0, 1340.0, 1340.0, 0.031494409742270746, 0.018915099601070812, 17.143200734213426], "isController": false}, {"data": ["Upload Tyre Rear Right Image", 9, 0, 0.0, 639.0, 435, 880, 597.0, 880.0, 880.0, 880.0, 0.06847960068783955, 0.049175129921020196, 37.284690505493586], "isController": false}, {"data": ["Upload Spare Tyre Image", 9, 0, 0.0, 1074.5555555555557, 568, 3556, 865.0, 3556.0, 3556.0, 3556.0, 0.06910690838727512, 0.04928816285042961, 37.62585465809357], "isController": false}, {"data": ["Upload Inventory Document in Yard Entry", 3, 0, 0.0, 726.0, 531, 909, 738.0, 909.0, 909.0, 909.0, 0.031280628949179407, 0.018786705863032552, 17.031324943173523], "isController": false}, {"data": ["Upload Release Document", 3, 0, 0.0, 697.3333333333334, 616, 826, 650.0, 826.0, 826.0, 826.0, 0.03137484574034177, 0.01884329114288105, 17.077659443044197], "isController": false}, {"data": ["Search the details after Employee approval", 3, 0, 0.0, 101.33333333333333, 98, 106, 100.0, 106.0, 106.0, 106.0, 0.032422968430836405, 0.0865351296108163, 0.06139466385487479], "isController": false}, {"data": ["Upload Rear Image", 9, 0, 0.0, 893.2222222222222, 479, 1802, 892.0, 1802.0, 1802.0, 1802.0, 0.07030590882104802, 0.0497313606341593, 38.2783861937748], "isController": false}, {"data": ["Upload Right Image", 9, 0, 0.0, 884.4444444444445, 548, 1603, 673.0, 1603.0, 1603.0, 1603.0, 0.0709309290375461, 0.05024274140159516, 38.618981584557545], "isController": false}, {"data": ["Upload Tyre Front Right Image", 9, 0, 0.0, 1017.1111111111111, 541, 1697, 952.0, 1697.0, 1697.0, 1697.0, 0.06857404091584442, 0.04930991418720713, 37.336199117109224], "isController": false}, {"data": ["Repo Agency Initiate Repossession", 3, 0, 0.0, 79.33333333333333, 74, 87, 77.0, 87.0, 87.0, 87.0, 0.03243348432922149, 0.019194034671394748, 0.06420182884309761], "isController": false}, {"data": ["Upload Inventory Document", 3, 0, 0.0, 637.6666666666666, 578, 687, 648.0, 687.0, 687.0, 687.0, 0.03132276016162544, 0.01881200927675747, 17.054417014914854], "isController": false}, {"data": ["Upload Engine Image", 9, 0, 0.0, 713.3333333333334, 533, 963, 608.0, 963.0, 963.0, 963.0, 0.06913079546501982, 0.04903515733016869, 37.638815177378106], "isController": false}]}, function(index, item){
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
