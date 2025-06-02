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

    var data = {"OkPercent": 93.33333333333333, "KoPercent": 6.666666666666667};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5599537037037037, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4666666666666667, 500, 1500, "Uplod Top Image"], "isController": false}, {"data": [0.3111111111111111, 500, 1500, "Upload video"], "isController": false}, {"data": [0.45555555555555555, 500, 1500, "Upload Chassis Image"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "Yard entry completed"], "isController": false}, {"data": [0.48333333333333334, 500, 1500, "Upload Back ID Document"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "Employee Approval"], "isController": false}, {"data": [0.5, 500, 1500, "Yard entry -Uplod Top Image"], "isController": false}, {"data": [0.9833333333333333, 500, 1500, "Token"], "isController": false}, {"data": [0.4666666666666667, 500, 1500, "Yard Exit -Uplod Top Image"], "isController": false}, {"data": [0.45, 500, 1500, "Uplod Front Image"], "isController": false}, {"data": [0.43333333333333335, 500, 1500, "Upload Interior Image"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "Search the details"], "isController": false}, {"data": [0.46111111111111114, 500, 1500, "Upload Front Image"], "isController": false}, {"data": [0.8833333333333333, 500, 1500, "Yard Exit Completed"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "Pre Repo Initiate"], "isController": false}, {"data": [0.8833333333333333, 500, 1500, "Reset Contract Number"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "Search Vehicle details"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "Vehicle release"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "Repo details submitted"], "isController": false}, {"data": [0.46111111111111114, 500, 1500, "Upload Tyre Front Left Image"], "isController": false}, {"data": [0.0, 500, 1500, "YMS Flow with Vehicle is Working"], "isController": true}, {"data": [0.4444444444444444, 500, 1500, "Upload Left Image"], "isController": false}, {"data": [0.43333333333333335, 500, 1500, "Submitted Repossession"], "isController": false}, {"data": [0.48333333333333334, 500, 1500, "Upload customer satisfaction Document"], "isController": false}, {"data": [0.9833333333333333, 500, 1500, "AgencyToken"], "isController": false}, {"data": [0.4444444444444444, 500, 1500, "Upload Tyre Rear Left Image"], "isController": false}, {"data": [0.4666666666666667, 500, 1500, "Uplod Rear Image"], "isController": false}, {"data": [0.95, 500, 1500, "YardToken"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "Initiate Request"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "sent OTP"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "Yard Exit Init"], "isController": false}, {"data": [0.43333333333333335, 500, 1500, "Repossession Kit"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "Yard init"], "isController": false}, {"data": [0.45, 500, 1500, "Upload Front ID Document"], "isController": false}, {"data": [0.4444444444444444, 500, 1500, "Upload Tyre Rear Right Image"], "isController": false}, {"data": [0.48333333333333334, 500, 1500, "Upload Spare Tyre Image"], "isController": false}, {"data": [0.4666666666666667, 500, 1500, "Upload Inventory Document in Yard Entry"], "isController": false}, {"data": [0.45, 500, 1500, "Upload Release Document"], "isController": false}, {"data": [0.85, 500, 1500, "Search the details after Employee approval"], "isController": false}, {"data": [0.4777777777777778, 500, 1500, "Upload Rear Image"], "isController": false}, {"data": [0.42777777777777776, 500, 1500, "Upload Right Image"], "isController": false}, {"data": [0.43333333333333335, 500, 1500, "Upload Tyre Front Right Image"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "Repo Agency Initiate Repossession"], "isController": false}, {"data": [0.45, 500, 1500, "Upload Inventory Document"], "isController": false}, {"data": [0.4388888888888889, 500, 1500, "Upload Engine Image"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2130, 142, 6.666666666666667, 860.3107981220654, 52, 180031, 599.5, 1294.0, 1630.8999999999996, 2770.6300000000015, 1.1615662275437346, 1.873240161554503, 469.9518177949083], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Uplod Top Image", 30, 2, 6.666666666666667, 809.0666666666666, 402, 1673, 727.0, 1277.6000000000001, 1601.5, 1673.0, 0.01688948590093866, 0.011847930376472271, 9.195548222684213], "isController": false}, {"data": ["Upload video", 90, 6, 6.666666666666667, 1462.288888888889, 710, 6217, 1284.5, 2262.0000000000005, 2715.7500000000005, 6217.0, 0.049745991440373075, 0.034911797248051754, 51.40233377705145], "isController": false}, {"data": ["Upload Chassis Image", 90, 6, 6.666666666666667, 802.7444444444445, 409, 2257, 655.0, 1409.000000000001, 1606.75, 2257.0, 0.049743214472843515, 0.03500052610358085, 27.08310764652693], "isController": false}, {"data": ["Yard entry completed", 30, 2, 6.666666666666667, 120.06666666666666, 60, 611, 101.5, 130.5, 381.0999999999997, 611.0, 0.01694452869640657, 0.009988005391749032, 0.03066231608832166], "isController": false}, {"data": ["Upload Back ID Document", 30, 2, 6.666666666666667, 788.2666666666667, 492, 1306, 831.0, 1099.9, 1302.7, 1306.0, 0.016940022157548983, 0.010184967749021149, 9.220811388946297], "isController": false}, {"data": ["Employee Approval", 30, 2, 6.666666666666667, 134.16666666666666, 53, 1185, 99.5, 126.00000000000004, 610.2499999999993, 1185.0, 0.01690032302150735, 0.010300834904124468, 0.033619099604307104], "isController": false}, {"data": ["Yard entry -Uplod Top Image", 30, 2, 6.666666666666667, 788.8333333333333, 474, 1498, 671.5, 1439.7000000000003, 1488.65, 1498.0, 0.016907380804374275, 0.01182966285837307, 9.205235036721422], "isController": false}, {"data": ["Token", 30, 0, 0.0, 122.16666666666669, 52, 619, 57.0, 349.8, 517.7999999999998, 619.0, 0.01690063721035829, 0.055488224903539614, 0.006189198197152693], "isController": false}, {"data": ["Yard Exit -Uplod Top Image", 30, 2, 6.666666666666667, 1005.8999999999999, 443, 6547, 711.0, 1535.6000000000004, 3927.8999999999965, 6547.0, 0.016938797864808064, 0.0118362055652985, 9.222336768392147], "isController": false}, {"data": ["Uplod Front Image", 30, 2, 6.666666666666667, 819.8333333333335, 467, 1809, 649.5, 1316.3000000000002, 1687.9999999999998, 1809.0, 0.01683038895028864, 0.011898515209061482, 9.163472910437084], "isController": false}, {"data": ["Upload Interior Image", 90, 6, 6.666666666666667, 900.8555555555557, 440, 3869, 756.5, 1468.3000000000009, 1821.0000000000002, 3869.0, 0.04973499536635627, 0.03504007431789836, 27.07852097604514], "isController": false}, {"data": ["Search the details", 30, 4, 13.333333333333334, 105.19999999999997, 60, 435, 85.5, 159.0000000000001, 371.19999999999993, 435.0, 0.016833420399524398, 0.038416583247716685, 0.032959968653365646], "isController": false}, {"data": ["Upload Front Image", 90, 6, 6.666666666666667, 932.6999999999998, 404, 3730, 686.5, 1639.5, 2183.650000000001, 3730.0, 0.04975424168731007, 0.034917587281378476, 27.08902566631295], "isController": false}, {"data": ["Yard Exit Completed", 30, 2, 6.666666666666667, 188.6, 53, 2155, 63.5, 383.0000000000004, 1612.1499999999992, 2155.0, 0.016993421846403255, 0.010001336815851917, 0.030518459741733978], "isController": false}, {"data": ["Pre Repo Initiate", 30, 2, 6.666666666666667, 619.6, 58, 3800, 535.5, 1115.5000000000007, 2350.749999999998, 3800.0, 0.016865055941390556, 0.010119033564834335, 0.038061664336478104], "isController": false}, {"data": ["Reset Contract Number", 30, 2, 6.666666666666667, 199.49999999999997, 60, 2069, 118.5, 217.80000000000015, 1210.9999999999989, 2069.0, 0.016814249067229534, 0.009795175823800122, 0.03254476723754779], "isController": false}, {"data": ["Search Vehicle details", 30, 4, 13.333333333333334, 75.93333333333334, 60, 305, 68.0, 74.9, 181.79999999999984, 305.0, 0.016833108704849397, 0.02109179753473512, 0.03258127095020654], "isController": false}, {"data": ["Vehicle release", 30, 2, 6.666666666666667, 76.69999999999997, 54, 288, 66.0, 94.00000000000003, 197.7999999999999, 288.0, 0.016944787105694803, 0.010094062631322101, 0.03402195536065285], "isController": false}, {"data": ["Repo details submitted", 30, 2, 6.666666666666667, 111.49999999999999, 54, 1033, 62.5, 263.7000000000004, 624.8999999999994, 1033.0, 0.01690093236810231, 0.010340817864285513, 0.04736882411763049], "isController": false}, {"data": ["Upload Tyre Front Left Image", 90, 6, 6.666666666666667, 813.6777777777778, 425, 2944, 702.5, 1215.7000000000005, 1498.6500000000005, 2944.0, 0.04975259141900471, 0.03536990326161405, 27.088515858949467], "isController": false}, {"data": ["YMS Flow with Vehicle is Working", 30, 4, 13.333333333333334, 61082.06666666667, 38701, 218625, 48961.5, 69672.0, 217005.8, 218625.0, 0.016357491894862766, 1.8729429389001333, 469.87725163431793], "isController": true}, {"data": ["Upload Left Image", 90, 6, 6.666666666666667, 885.9999999999999, 451, 2662, 712.5, 1534.1000000000006, 2048.550000000001, 2662.0, 0.049752811448453595, 0.03487123592340942, 27.08820485481715], "isController": false}, {"data": ["Submitted Repossession", 30, 2, 6.666666666666667, 996.3333333333331, 57, 5395, 803.0, 1320.7000000000003, 3441.9499999999975, 5395.0, 0.01690197026267352, 0.01034145289899777, 0.03580114599583874], "isController": false}, {"data": ["Upload customer satisfaction Document", 30, 2, 6.666666666666667, 812.6333333333332, 428, 3452, 675.0, 1058.9000000000003, 2252.999999999998, 3452.0, 0.016932010077932397, 0.010180150590475633, 9.216607329084058], "isController": false}, {"data": ["AgencyToken", 60, 0, 0.0, 149.88333333333335, 52, 1344, 66.5, 332.2, 379.7499999999999, 1344.0, 0.033549654047150684, 0.11260757906255557, 0.012253486927377301], "isController": false}, {"data": ["Upload Tyre Rear Left Image", 90, 6, 6.666666666666667, 879.4888888888889, 445, 2664, 748.5, 1464.0000000000002, 1867.25, 2664.0, 0.0497576250796122, 0.03532812976843907, 27.091240310911903], "isController": false}, {"data": ["Uplod Rear Image", 30, 2, 6.666666666666667, 808.1333333333332, 475, 3039, 632.0, 1008.9, 2489.5499999999993, 3039.0, 0.016835120755515326, 0.011886515924060138, 9.166060697309298], "isController": false}, {"data": ["YardToken", 30, 0, 0.0, 141.36666666666667, 56, 883, 68.5, 538.4000000000008, 748.7999999999998, 883.0, 0.016912346689577258, 0.05402371681797579, 0.006127422482258948], "isController": false}, {"data": ["Initiate Request", 30, 2, 6.666666666666667, 109.46666666666668, 57, 496, 81.5, 133.60000000000002, 450.8999999999999, 496.0, 0.016833004809189474, 0.009650484397768392, 0.03263038529906358], "isController": false}, {"data": ["sent OTP", 30, 2, 6.666666666666667, 100.73333333333333, 52, 1148, 62.5, 90.00000000000003, 571.5999999999992, 1148.0, 0.016940567407364743, 0.010140076610892673, 0.030489712628684787], "isController": false}, {"data": ["Yard Exit Init", 30, 2, 6.666666666666667, 68.83333333333333, 52, 139, 62.0, 92.20000000000002, 134.6, 139.0, 0.016942854012463163, 0.010295872353667395, 0.037989055481069754], "isController": false}, {"data": ["Repossession Kit", 30, 4, 13.333333333333334, 776.1999999999999, 58, 1132, 809.5, 1040.4, 1121.55, 1132.0, 0.01685599697041548, 0.8938880049635293, 0.03430458758432212], "isController": false}, {"data": ["Yard init", 30, 2, 6.666666666666667, 64.83333333333334, 54, 105, 62.0, 75.30000000000001, 103.35, 105.0, 0.01691235622383165, 0.009907381595184714, 0.04406461563006137], "isController": false}, {"data": ["Upload Front ID Document", 30, 2, 6.666666666666667, 858.7666666666668, 486, 1963, 709.0, 1462.7000000000005, 1942.1, 1963.0, 0.016935996048267586, 0.01018254710323901, 9.218570275562769], "isController": false}, {"data": ["Upload Tyre Rear Right Image", 90, 6, 6.666666666666667, 853.1444444444443, 417, 3151, 647.0, 1326.5000000000002, 2003.2000000000023, 3151.0, 0.04975426919270934, 0.03537109601744716, 27.089390476514602], "isController": false}, {"data": ["Upload Spare Tyre Image", 90, 6, 6.666666666666667, 830.4000000000004, 443, 2138, 691.5, 1265.4, 1767.0000000000002, 2138.0, 0.049756112123740134, 0.03514565307108545, 27.090235158270044], "isController": false}, {"data": ["Upload Inventory Document in Yard Entry", 30, 2, 6.666666666666667, 879.4333333333333, 440, 1810, 866.0, 1344.4, 1562.4999999999998, 1810.0, 0.016902341650412246, 0.010162312834736792, 9.202948687448659], "isController": false}, {"data": ["Upload Release Document", 30, 2, 6.666666666666667, 819.5000000000002, 485, 2320, 650.5, 1551.7000000000007, 2148.3999999999996, 2320.0, 0.01693581439250669, 0.01018243788507808, 9.218451550375015], "isController": false}, {"data": ["Search the details after Employee approval", 30, 4, 13.333333333333334, 12128.96666666667, 67, 180031, 98.0, 504.9000000000004, 180017.25, 180031.0, 0.016900380145884082, 0.0401004430082564, 0.032001794045770734], "isController": false}, {"data": ["Upload Rear Image", 90, 6, 6.666666666666667, 785.0, 428, 1961, 636.0, 1154.4, 1472.9500000000003, 1961.0, 0.04975558948763906, 0.03487318302261889, 27.089707656369377], "isController": false}, {"data": ["Upload Right Image", 90, 6, 6.666666666666667, 883.6222222222225, 438, 3218, 807.0, 1366.6000000000004, 1805.400000000001, 3218.0, 0.04973436323989536, 0.034903636562825, 27.078165478245637], "isController": false}, {"data": ["Upload Tyre Front Right Image", 90, 6, 6.666666666666667, 873.7888888888889, 436, 3331, 776.5, 1461.1000000000004, 1713.2500000000002, 3331.0, 0.049742554644959754, 0.03540810622633083, 27.083115961536016], "isController": false}, {"data": ["Repo Agency Initiate Repossession", 30, 2, 6.666666666666667, 143.49999999999997, 60, 1180, 69.5, 84.60000000000001, 1170.65, 1180.0, 0.0169008371548004, 0.010017267021959821, 0.03345507511013712], "isController": false}, {"data": ["Upload Inventory Document", 30, 2, 6.666666666666667, 885.9333333333334, 432, 2354, 752.0, 1289.9, 1854.0499999999993, 2354.0, 0.016888012213410433, 0.010141603167740744, 9.195113643656187], "isController": false}, {"data": ["Upload Engine Image", 90, 6, 6.666666666666667, 837.0666666666668, 374, 3004, 642.5, 1362.7000000000005, 1736.8500000000004, 3004.0, 0.04973568247856116, 0.034949894408383, 27.07894364847013], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400", 100, 70.4225352112676, 4.694835680751174], "isController": false}, {"data": ["504/Gateway Time-out", 2, 1.408450704225352, 0.09389671361502347], "isController": false}, {"data": ["500", 4, 2.816901408450704, 0.18779342723004694], "isController": false}, {"data": ["404", 36, 25.35211267605634, 1.6901408450704225], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2130, 142, "400", 100, "404", 36, "500", 4, "504/Gateway Time-out", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Uplod Top Image", 30, 2, "400", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Upload video", 90, 6, "400", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Upload Chassis Image", 90, 6, "400", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Yard entry completed", 30, 2, "404", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Upload Back ID Document", 30, 2, "400", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Employee Approval", 30, 2, "404", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Yard entry -Uplod Top Image", 30, 2, "400", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Yard Exit -Uplod Top Image", 30, 2, "400", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Uplod Front Image", 30, 2, "400", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Upload Interior Image", 90, 6, "400", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Search the details", 30, 4, "404", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Upload Front Image", 90, 6, "400", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Yard Exit Completed", 30, 2, "404", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Pre Repo Initiate", 30, 2, "404", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Reset Contract Number", 30, 2, "500", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Search Vehicle details", 30, 4, "404", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Vehicle release", 30, 2, "404", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Repo details submitted", 30, 2, "404", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Upload Tyre Front Left Image", 90, 6, "400", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Upload Left Image", 90, 6, "400", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Submitted Repossession", 30, 2, "404", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Upload customer satisfaction Document", 30, 2, "400", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Upload Tyre Rear Left Image", 90, 6, "400", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Uplod Rear Image", 30, 2, "400", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Initiate Request", 30, 2, "404", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["sent OTP", 30, 2, "404", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Yard Exit Init", 30, 2, "404", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Repossession Kit", 30, 4, "500", 2, "404", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["Yard init", 30, 2, "404", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Upload Front ID Document", 30, 2, "400", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Upload Tyre Rear Right Image", 90, 6, "400", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Upload Spare Tyre Image", 90, 6, "400", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Upload Inventory Document in Yard Entry", 30, 2, "400", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Upload Release Document", 30, 2, "400", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Search the details after Employee approval", 30, 4, "504/Gateway Time-out", 2, "404", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["Upload Rear Image", 90, 6, "400", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Upload Right Image", 90, 6, "400", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Upload Tyre Front Right Image", 90, 6, "400", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Repo Agency Initiate Repossession", 30, 2, "404", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Upload Inventory Document", 30, 2, "400", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Upload Engine Image", 90, 6, "400", 6, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
