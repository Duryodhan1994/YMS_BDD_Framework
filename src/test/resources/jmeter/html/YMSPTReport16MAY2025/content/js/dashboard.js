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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6482758620689655, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4166666666666667, 500, 1500, "Upload video"], "isController": false}, {"data": [1.0, 500, 1500, "Yard entry completed"], "isController": false}, {"data": [1.0, 500, 1500, "Employee Approval"], "isController": false}, {"data": [0.5, 500, 1500, "Yard entry -Uplod Top Image"], "isController": false}, {"data": [1.0, 500, 1500, "Token"], "isController": false}, {"data": [0.0, 500, 1500, "YMS Flow with Vehicle is not Working"], "isController": true}, {"data": [1.0, 500, 1500, "Yard Exit Completed"], "isController": false}, {"data": [1.0, 500, 1500, "Pre Repo Initiate"], "isController": false}, {"data": [1.0, 500, 1500, "Reset Contract Number"], "isController": false}, {"data": [1.0, 500, 1500, "Search Vehicle details"], "isController": false}, {"data": [1.0, 500, 1500, "Vehicle release"], "isController": false}, {"data": [0.625, 500, 1500, "Upload Tyre Front Left Image"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "Upload Tyre Rear Left Image"], "isController": false}, {"data": [0.0, 500, 1500, "YMS Flow with Vehicle is Accidental"], "isController": true}, {"data": [1.0, 500, 1500, "YardToken"], "isController": false}, {"data": [1.0, 500, 1500, "Initiate Request"], "isController": false}, {"data": [1.0, 500, 1500, "sent OTP"], "isController": false}, {"data": [1.0, 500, 1500, "Yard Exit Init"], "isController": false}, {"data": [1.0, 500, 1500, "Yard init"], "isController": false}, {"data": [0.375, 500, 1500, "Upload Front ID Document"], "isController": false}, {"data": [0.0, 500, 1500, "YMS Flow with Vehicle is Loaded with hazardous Material"], "isController": true}, {"data": [0.5, 500, 1500, "Upload Inventory Document in Yard Entry"], "isController": false}, {"data": [0.5, 500, 1500, "Upload Release Document"], "isController": false}, {"data": [0.5, 500, 1500, "Upload Engine Image"], "isController": false}, {"data": [0.625, 500, 1500, "Uplod Top Image"], "isController": false}, {"data": [1.0, 500, 1500, "RVMToken"], "isController": false}, {"data": [0.4583333333333333, 500, 1500, "Upload Chassis Image"], "isController": false}, {"data": [0.5, 500, 1500, "Upload Back ID Document"], "isController": false}, {"data": [0.75, 500, 1500, "Yard Exit -Uplod Top Image"], "isController": false}, {"data": [0.625, 500, 1500, "Uplod Front Image"], "isController": false}, {"data": [0.5, 500, 1500, "Upload Interior Image"], "isController": false}, {"data": [1.0, 500, 1500, "Search the details"], "isController": false}, {"data": [0.5, 500, 1500, "Upload Front Image"], "isController": false}, {"data": [1.0, 500, 1500, "Repo details submitted"], "isController": false}, {"data": [0.0, 500, 1500, "YMS Flow with Vehicle is Working"], "isController": true}, {"data": [0.5, 500, 1500, "Upload Left Image"], "isController": false}, {"data": [0.5, 500, 1500, "Submitted Repossession"], "isController": false}, {"data": [0.625, 500, 1500, "Upload customer satisfaction Document"], "isController": false}, {"data": [0.9375, 500, 1500, "AgencyToken"], "isController": false}, {"data": [0.625, 500, 1500, "Uplod Rear Image"], "isController": false}, {"data": [0.5, 500, 1500, "Repossession Kit"], "isController": false}, {"data": [1.0, 500, 1500, "RVMApproval"], "isController": false}, {"data": [0.5416666666666666, 500, 1500, "Upload Tyre Rear Right Image"], "isController": false}, {"data": [0.5416666666666666, 500, 1500, "Upload Spare Tyre Image"], "isController": false}, {"data": [1.0, 500, 1500, "Search the details after Employee approval"], "isController": false}, {"data": [0.625, 500, 1500, "Upload Rear Image"], "isController": false}, {"data": [0.5, 500, 1500, "Upload Right Image"], "isController": false}, {"data": [0.5416666666666666, 500, 1500, "Upload Tyre Front Right Image"], "isController": false}, {"data": [1.0, 500, 1500, "Repo Agency Initiate Repossession"], "isController": false}, {"data": [0.5, 500, 1500, "Upload Inventory Document"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 286, 0, 0.0, 592.8776223776227, 53, 2100, 571.5, 1072.0000000000005, 1382.2499999999995, 1905.8899999999994, 1.6819967536286433, 2.9282459394628195, 675.7691489320644], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Upload video", 12, 0, 0.0, 1191.8333333333333, 908, 1734, 1018.5, 1685.7000000000003, 1734.0, 1734.0, 0.0761532457147934, 0.05394188238131199, 78.68919589708524], "isController": false}, {"data": ["Yard entry completed", 4, 0, 0.0, 97.25, 90, 105, 97.0, 105.0, 105.0, 105.0, 0.03034394865803887, 0.017898188466265116, 0.05490950865561135], "isController": false}, {"data": ["Employee Approval", 4, 0, 0.0, 98.5, 89, 120, 92.5, 120.0, 120.0, 120.0, 0.03159133449694748, 0.019312671284266725, 0.06287415986794823], "isController": false}, {"data": ["Yard entry -Uplod Top Image", 4, 0, 0.0, 568.5, 519, 617, 569.0, 617.0, 617.0, 617.0, 0.03092241565911129, 0.02183291652493893, 16.83578318989842], "isController": false}, {"data": ["Token", 4, 0, 0.0, 130.5, 53, 361, 54.0, 361.0, 361.0, 361.0, 0.03152460889782086, 0.10353248019860503, 0.011544656578791819], "isController": false}, {"data": ["YMS Flow with Vehicle is not Working", 1, 0, 0.0, 46577.0, 46577, 46577, 46577.0, 46577.0, 46577.0, 46577.0, 0.021469824162140112, 2.6533473804130794, 616.7360675937158], "isController": true}, {"data": ["Yard Exit Completed", 4, 0, 0.0, 58.0, 54, 63, 57.5, 63.0, 63.0, 63.0, 0.03036975172727963, 0.01788375028471642, 0.05454098967428441], "isController": false}, {"data": ["Pre Repo Initiate", 4, 0, 0.0, 91.75, 83, 110, 87.0, 110.0, 110.0, 110.0, 0.03151070182210633, 0.01889411222536454, 0.07356087178295428], "isController": false}, {"data": ["Reset Contract Number", 4, 0, 0.0, 159.5, 86, 197, 177.5, 197.0, 197.0, 197.0, 0.031355580117426646, 0.01818868612280413, 0.06069019511009728], "isController": false}, {"data": ["Search Vehicle details", 4, 0, 0.0, 66.5, 61, 74, 65.5, 74.0, 74.0, 74.0, 0.03138879733822998, 0.04239326828005085, 0.060754488598019366], "isController": false}, {"data": ["Vehicle release", 4, 0, 0.0, 64.0, 53, 89, 57.0, 89.0, 89.0, 89.0, 0.030351777096549005, 0.018080648465717667, 0.06094067745166479], "isController": false}, {"data": ["Upload Tyre Front Left Image", 12, 0, 0.0, 688.4166666666666, 491, 1194, 581.5, 1094.1000000000004, 1194.0, 1194.0, 0.0770267668014635, 0.05531284100391553, 41.93852326248476], "isController": false}, {"data": ["Upload Tyre Rear Left Image", 12, 0, 0.0, 738.0833333333333, 475, 1138, 711.5, 1099.0000000000002, 1138.0, 1138.0, 0.07713321549092078, 0.05531395629117789, 41.99633039731641], "isController": false}, {"data": ["YMS Flow with Vehicle is Accidental", 1, 0, 0.0, 42764.0, 42764, 42764, 42764.0, 42764.0, 42764.0, 42764.0, 0.023384154896642036, 2.980063911818352, 671.7799105263773], "isController": true}, {"data": ["YardToken", 4, 0, 0.0, 75.25, 58, 103, 70.0, 103.0, 103.0, 103.0, 0.031030122491408536, 0.0991206354193333, 0.01124235883233649], "isController": false}, {"data": ["Initiate Request", 4, 0, 0.0, 73.0, 70, 75, 73.5, 75.0, 75.0, 75.0, 0.0313883047176622, 0.01805440574092093, 0.06084549303179635], "isController": false}, {"data": ["sent OTP", 4, 0, 0.0, 55.0, 53, 57, 55.0, 57.0, 57.0, 57.0, 0.030419870259253343, 0.018240039393731988, 0.05474982508574601], "isController": false}, {"data": ["Yard Exit Init", 4, 0, 0.0, 58.25, 54, 70, 54.5, 70.0, 70.0, 70.0, 0.030443717177867417, 0.01855164015526296, 0.0682605221097496], "isController": false}, {"data": ["Yard init", 4, 0, 0.0, 57.5, 53, 61, 58.0, 61.0, 61.0, 61.0, 0.031042163017919087, 0.018188767393311964, 0.08087938567559387], "isController": false}, {"data": ["Upload Front ID Document", 4, 0, 0.0, 1071.75, 616, 2039, 816.0, 2039.0, 2039.0, 2039.0, 0.030211480362537763, 0.018144590256797582, 16.444796190521146], "isController": false}, {"data": ["YMS Flow with Vehicle is Loaded with hazardous Material", 1, 0, 0.0, 41957.0, 41957, 41957, 41957.0, 41957.0, 41957.0, 41957.0, 0.023833925209142695, 2.9419768676859643, 684.6464926144624], "isController": true}, {"data": ["Upload Inventory Document in Yard Entry", 4, 0, 0.0, 807.5, 655, 1044, 765.5, 1044.0, 1044.0, 1044.0, 0.030865150158955523, 0.018537175144294576, 16.805215221727522], "isController": false}, {"data": ["Upload Release Document", 4, 0, 0.0, 740.75, 515, 995, 726.5, 995.0, 995.0, 995.0, 0.03023385889858052, 0.0181580304908467, 16.45680018537135], "isController": false}, {"data": ["Upload Engine Image", 12, 0, 0.0, 735.9166666666667, 476, 1790, 584.0, 1555.7000000000007, 1790.0, 1790.0, 0.0771495801777012, 0.05472296067943064, 42.004844852997905], "isController": false}, {"data": ["Uplod Top Image", 4, 0, 0.0, 526.0, 460, 594, 525.0, 594.0, 594.0, 594.0, 0.031485154749535595, 0.02229173554044268, 17.142321570184347], "isController": false}, {"data": ["RVMToken", 1, 0, 0.0, 64.0, 64, 64, 64.0, 64.0, 64.0, 64.0, 15.625, 51.544189453125, 5.7220458984375], "isController": false}, {"data": ["Upload Chassis Image", 12, 0, 0.0, 737.1666666666666, 527, 1655, 600.0, 1449.2000000000007, 1655.0, 1655.0, 0.07713718205017774, 0.054789495844234315, 41.998151067948214], "isController": false}, {"data": ["Upload Back ID Document", 4, 0, 0.0, 809.0, 556, 918, 881.0, 918.0, 918.0, 918.0, 0.030144770259169663, 0.018104525106825527, 16.40814582344208], "isController": false}, {"data": ["Yard Exit -Uplod Top Image", 4, 0, 0.0, 599.5, 484, 772, 571.0, 772.0, 772.0, 772.0, 0.030344409042633896, 0.021395179032013354, 16.52121204578213], "isController": false}, {"data": ["Uplod Front Image", 4, 0, 0.0, 690.5, 480, 1194, 544.0, 1194.0, 1194.0, 1194.0, 0.03128911138923655, 0.02233626994680851, 17.03556141954787], "isController": false}, {"data": ["Upload Interior Image", 12, 0, 0.0, 879.0833333333333, 517, 1391, 846.5, 1358.6000000000001, 1391.0, 1391.0, 0.07719126709464937, 0.054903293815692984, 42.027767849676444], "isController": false}, {"data": ["Search the details", 4, 0, 0.0, 79.25, 77, 81, 79.5, 81.0, 81.0, 81.0, 0.03138756581580207, 0.07966433940944295, 0.06145709908269839], "isController": false}, {"data": ["Upload Front Image", 12, 0, 0.0, 827.0, 521, 1233, 869.0, 1211.1000000000001, 1233.0, 1233.0, 0.07716744048461154, 0.054660270343266495, 42.01455023238653], "isController": false}, {"data": ["Repo details submitted", 4, 0, 0.0, 55.0, 53, 57, 55.0, 57.0, 57.0, 57.0, 0.031602566128369626, 0.019350399377429446, 0.08857359842619221], "isController": false}, {"data": ["YMS Flow with Vehicle is Working", 1, 0, 0.0, 38265.0, 38265, 38265, 38265.0, 38265.0, 38265.0, 38265.0, 0.026133542401672545, 3.22608882954397, 750.70320666732], "isController": true}, {"data": ["Upload Left Image", 12, 0, 0.0, 798.9166666666667, 485, 1599, 826.5, 1407.3000000000006, 1599.0, 1599.0, 0.07735896493704914, 0.05472038763288013, 42.1186764586194], "isController": false}, {"data": ["Submitted Repossession", 4, 0, 0.0, 918.75, 752, 1107, 908.0, 1107.0, 1107.0, 1107.0, 0.030874917988499097, 0.018904857010536066, 0.06539814171587356], "isController": false}, {"data": ["Upload customer satisfaction Document", 4, 0, 0.0, 555.5, 435, 640, 573.5, 640.0, 640.0, 640.0, 0.03033221356911574, 0.0182171009228576, 16.51095093622273], "isController": false}, {"data": ["AgencyToken", 8, 0, 0.0, 146.12500000000003, 55, 632, 68.0, 632.0, 632.0, 632.0, 0.06115974160009174, 0.20527932800733917, 0.022337639998471007], "isController": false}, {"data": ["Uplod Rear Image", 4, 0, 0.0, 614.75, 402, 936, 560.5, 936.0, 936.0, 936.0, 0.031317038034542694, 0.022325622817593913, 17.050919179532748], "isController": false}, {"data": ["Repossession Kit", 4, 0, 0.0, 1132.0, 927, 1423, 1089.0, 1423.0, 1423.0, 1423.0, 0.0312722326028661, 1.910171489105536, 0.0636438796331767], "isController": false}, {"data": ["RVMApproval", 1, 0, 0.0, 101.0, 101, 101, 101.0, 101.0, 101.0, 101.0, 9.900990099009901, 6.0527537128712865, 19.88900061881188], "isController": false}, {"data": ["Upload Tyre Rear Right Image", 12, 0, 0.0, 783.25, 460, 1886, 590.0, 1730.0000000000005, 1886.0, 1886.0, 0.07735447689035002, 0.055548169277380266, 42.116931666183206], "isController": false}, {"data": ["Upload Spare Tyre Image", 12, 0, 0.0, 787.9999999999999, 487, 2100, 622.0, 1840.200000000001, 2100.0, 2100.0, 0.07633733468195958, 0.054445019625056455, 41.563019849297376], "isController": false}, {"data": ["Search the details after Employee approval", 4, 0, 0.0, 87.5, 87, 88, 87.5, 88.0, 88.0, 88.0, 0.031592332540892325, 0.0842642170432736, 0.059852661259112414], "isController": false}, {"data": ["Upload Rear Image", 12, 0, 0.0, 635.4166666666667, 441, 945, 573.0, 921.0000000000001, 945.0, 945.0, 0.0773903958518748, 0.05474262050329554, 42.1356003177037], "isController": false}, {"data": ["Upload Right Image", 12, 0, 0.0, 659.6666666666666, 533, 1183, 605.5, 1086.1000000000004, 1183.0, 1183.0, 0.07734450531743474, 0.05478569126651627, 42.11076604294231], "isController": false}, {"data": ["Upload Tyre Front Right Image", 12, 0, 0.0, 804.1666666666666, 465, 1588, 707.0, 1553.8000000000002, 1588.0, 1588.0, 0.07715702096742044, 0.055481725038096286, 42.009027924009985], "isController": false}, {"data": ["Repo Agency Initiate Repossession", 4, 0, 0.0, 64.5, 62, 67, 64.5, 67.0, 67.0, 67.0, 0.03160006952015294, 0.018700822391809264, 0.06255209073959964], "isController": false}, {"data": ["Upload Inventory Document", 4, 0, 0.0, 850.75, 572, 1274, 778.5, 1274.0, 1274.0, 1274.0, 0.030920264368260352, 0.018570275963359487, 16.835329059250956], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 286, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
