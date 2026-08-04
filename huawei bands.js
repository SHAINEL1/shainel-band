// ============================================================
//  🚀 سكربت هواوي المتقدم - الإصدار 7.0 (Smart CA Profiles)
//  ✍️ تم التطوير بواسطة: SHAINEL
//  ☕ ادعم المشروع: https://ko-fi.com/shainel
//  ⚠️ تنبيه: هذا الكود مخصص لراوترات هواوي فقط.
// ============================================================

var mainband = null, _2ndrun = null, suspend = 0, status = "", netmode = "", signal = "", version = "7.0", scanResults = [], bestBands = null, routerType = "unknown";

function err(n, e, r) { console.error("❌ خطأ في الاتصال:", n); console.error("   التفاصيل:", e); console.error("   الرسالة:", r); }
function extractXML(n, e) { try { return e.split("</" + n + ">")[0].split("<" + n + ">")[1]; } catch (n) { return null; } }
function setgraph(n, r, t, a) {
    if (r === undefined || r === null || r === 'undefined' || r === 'null') { $("#" + n + "b").html(n.replace("nr", "5G - ") + " : --").css("background-color", "#555").css("color", "#ccc"); return; }
    r = parseInt(r.replace("dBm", "").replace("dB", "")); x = (r - t) / (a - t) * 100; xs = String(x) + String.fromCharCode(37); e = "#" + n + "b"; $(e).animate({ width: xs }); $(e).html(n.replace("nr", "5G - ") + " : " + window[n]); x < 50 ? $(e).css("background-color", "yellow").css("color", "black") : (85 < x ? $(e).css("background-color", "orange") : $(e).css("background-color", "green")).css("color", "white");
}
function _4GType(n) { if (!n) return "غير معروف"; for (data_out = "", x = 0; x < 90; x++) { tb = Math.pow(2, x); color = BigInt("0x" + n) & BigInt(tb) ? (data_out += "B" + String(x + 1) + "+", "#686") : "transparent"; $("#cb" + String(x + 1)).css("background-color", color); } return data_out = data_out.replace(/\++$/, ""), data_out || "لا يوجد"; }

function getAntenna(callback) { $.ajax({ dataType: "text", type: "GET", async: true, url: "/api/device/antenna_type", error: function() { callback && callback(false); }, success: function(n) { antenna1type = extractXML("antenna1type", n); antenna2type = extractXML("antenna2type", n); "1" == antenna1type ? $("#a1").html("EXT") : $("#a1").html("INT"); "1" == antenna2type ? $("#a2").html("EXT") : $("#a2").html("INT"); callback && callback(true); } }); }
function getNetmode(callback) { $.ajax({ type: "GET", dataType: "text", async: true, url: "/api/net/net-mode", error: function() { callback && callback(false); }, success: function(n) { netmode = n; lteband = extractXML("LTEBand", n); $("#allowed").html(_4GType(lteband)); callback && callback(true); } }); }
function getStatus(callback) { $.ajax({ type: "GET", dataType: "text", async: true, url: "/api/monitoring/status", error: function() { callback && callback(false); }, success: function(n) { status = n; is4gp = 1011 == extractXML("CurrentNetworkTypeEx", n) ? 1 : 0; is4gp ? $("#mode").html("4G+").css("color", "red") : $("#mode").html("-").css("color", "#aaa"); callback && callback(true); } }); }

function currentBand() {
    if (1 != suspend) { $("#dhcp_mask").show(); $("#dhcp_dns").show(); $.ajax({ dataType: "text", type: "GET", async: true, url: "/api/device/signal", error: function() {}, success: function(n) { for (signal = n, vars = ["nrrsrq", "nrrsrp", "nrsinr", "rssi", "rsrp", "rsrq", "sinr", "dlbandwidth", "ulbandwidth", "band", "cell_id", "plmn"], i = 0; i < vars.length; i++) { window[vars[i]] = extractXML(vars[i], n); var displayVal = window[vars[i]]; if (displayVal === undefined || displayVal === null || displayVal === 'undefined' || displayVal === 'null') { displayVal = '--'; } if ($("#" + vars[i]).length) $("#" + vars[i]).html(displayVal); } nrdefined = "undefined" != typeof nrrsrp && nrrsrp !== null && nrrsrp !== '--'; $(".e5").toggle(nrdefined); if (nrdefined) { setgraph("nrrsrp", nrrsrp, -130, -70); setgraph("nrrsrq", nrrsrq, -16, -3); routerType = "5G"; } else { routerType = "4G"; } setgraph("rsrp", rsrp, -130, -70); setgraph("rsrq", rsrq, -16, -3); hex = Number(cell_id).toString(16); hex2 = hex.substring(0, hex.length - 2); enbid = parseInt(hex2, 16).toString(); $("#enbid").html(enbid); if (plmn) { "22201" == plmn && (plmn = "2221"); "22299" == plmn && (plmn = "22288"); "22250" == plmn && 6 == enbid.length && (plmn = "22288"); link_lte = "https://lteitaly.it/internal/map.php#bts=" + plmn + "." + enbid; $("#lteitaly").attr("href", link_lte); } } }); getNetmode(); getStatus(); getAntenna(); }
}

function ltebandselection(n) {
    if (mainband = mainband && null, 0 == arguments.length) { if (null == (e = (e = prompt("Please input LTE bands number, separated by + char (example 1+3+20).If you want to use every supported bands, write 'AUTO'.", "AUTO")) && e.toLowerCase()) || "" === e) return } else var e = arguments[0];
    var n = e.split("+"), t = 0;
    if ("AUTO" === e.toUpperCase()) t = "7FFFFFFFFFFFFFFF";
    else { for (var r = 0; r < n.length; r++) { if (-1 != n[r].toLowerCase().indexOf("m") && (n[r] = n[r].replace("m", ""), mainband = n[r]), "AUTO" === n[r].toUpperCase()) { t = "7FFFFFFFFFFFFFFF"; break } t += Math.pow(2, parseInt(n[r]) - 1) } t = t.toString(16) }
    if (mainband) return _2ndrun = n, void ltebandselection(String(mainband));
    suspend = 1; $("#t").html("⏳ جاري التطبيق... يرجى الانتظار").show();
    $.ajax({ type: "GET", dataType: "text", async: !0, url: "/html/home.html", error: err, success: function(n) { var n = n.split('name="csrf_token" content="'), e = n[n.length - 1].split('"')[0], r = "00"; $("#force4g").is(":checked") && (r = "03"); setTimeout(function() { $.ajax({ type: "POST", async: !0, url: "/api/net/net-mode", headers: { __RequestVerificationToken: e }, contentType: "application/xml", data: "<request><NetworkMode>" + r + "</NetworkMode><NetworkBand>3FFFFFFF</NetworkBand><LTEBand>" + t + "</LTEBand></request>", success: function(n) { $("#band").html('<span style="color:green;">✅ تم التطبيق</span>'); if (_2ndrun) { window.setTimeout(function() { ltebandselection(_2ndrun.join("+")); _2ndrun = !1; }, 2e3); } else { suspend = 0; $("#t").hide(""); setTimeout(currentBand, 1500); } }, error: function(xhr, status, error) { err(xhr, status, error); suspend = 0; $("#t").html("❌ فشل التطبيق").css("background-color", "#d9534f").delay(3000).fadeOut(); } }); }, 2e3); } });
}

//  ---------------- الإضافات الجديدة (الإصدار 7.0) ----------------
function getBandInfo(band) { var bandInfo = { 1: { freq: 2100, name: "2100" }, 2: { freq: 1900, name: "1900" }, 3: { freq: 1800, name: "1800" }, 4: { freq: 1700, name: "1700" }, 5: { freq: 850, name: "850" }, 7: { freq: 2600, name: "2600" }, 8: { freq: 900, name: "900" }, 12: { freq: 700, name: "700" }, 13: { freq: 700, name: "700" }, 17: { freq: 700, name: "700" }, 18: { freq: 850, name: "850" }, 19: { freq: 850, name: "850" }, 20: { freq: 800, name: "800" }, 21: { freq: 1500, name: "1500" }, 25: { freq: 1900, name: "1900" }, 26: { freq: 850, name: "850" }, 28: { freq: 700, name: "700" }, 32: { freq: 1500, name: "1500" }, 38: { freq: 2600, name: "2600 (TD)" }, 39: { freq: 1900, name: "1900 (TD)" }, 40: { freq: 2300, name: "2300 (TD)" }, 41: { freq: 2500, name: "2500 (TD)" }, 42: { freq: 3500, name: "3500" }, 43: { freq: 3700, name: "3700" }, 46: { freq: 5200, name: "5200" }, 48: { freq: 3500, name: "3500" }, 66: { freq: 1700, name: "1700" }, 71: { freq: 600, name: "600" } }; return bandInfo[band] || { freq: "غير معروف", name: "غير معروف" }; }
function getCurrentMetrics() { var rsrp_val = parseInt(window.rsrp) || -999; var rsrq_val = parseFloat(window.rsrq) || -999; var sinr_val = parseFloat(window.sinr) || -999; var current_band = window.band || 'غير معروف'; return { rsrp: rsrp_val, rsrq: rsrq_val, sinr: sinr_val, band: current_band }; }

function doSetBand(bandStr, silent, callback) {
    var bands = bandStr.split('+'); var t = 0;
    for (var i = 0; i < bands.length; i++) { if (-1 != bands[i].toLowerCase().indexOf("m")) { bands[i] = bands[i].replace("m", ""); } if ("AUTO" === bands[i].toUpperCase()) { t = "7FFFFFFFFFFFFFFF"; break; } t += Math.pow(2, parseInt(bands[i]) - 1); } var hexBand = t.toString(16);
    $.ajax({ type: "GET", dataType: "text", async: false, url: "/html/home.html", error: function() { if (callback) callback(false, "فشل في جلب التوكن"); }, success: function(data) { var parts = data.split('name="csrf_token" content="'); if (parts.length < 2) { if (callback) callback(false, "لم يتم العثور على التوكن"); return; } var token = parts[parts.length - 1].split('"')[0]; var mode = "00"; if ($("#force4g").is(":checked")) mode = "03"; $.ajax({ type: "POST", async: true, url: "/api/net/net-mode", headers: { __RequestVerificationToken: token }, contentType: "application/xml", data: "<request><NetworkMode>" + mode + "</NetworkMode><NetworkBand>3FFFFFFF</NetworkBand><LTEBand>" + hexBand + "</LTEBand></request>", success: function() { if (!silent) { $("#band").html('<span style="color:green;">✅ تم التطبيق</span>'); } if (callback) callback(true, "تم التطبيق بنجاح"); }, error: function(xhr, status, error) { err(xhr, status, error); if (callback) callback(false, "خطأ في التطبيق: " + error); } }); } });
}

function evaluateSignal(rsrp, rsrq, sinr) { var score = 0; if (rsrp >= -80) score += 40; else if (rsrp >= -90) score += 30; else if (rsrp >= -100) score += 20; else if (rsrp >= -110) score += 10; else score += 5; if (rsrq >= -8) score += 30; else if (rsrq >= -12) score += 20; else if (rsrq >= -16) score += 10; else score += 5; if (sinr >= 20) score += 30; else if (sinr >= 15) score += 20; else if (sinr >= 10) score += 10; else score += 5; return Math.min(score, 100); }

function autoSelectBand() {
    if (window.triggerAllAds) window.triggerAllAds();
    var supportedBands = [3, 7, 20, 1, 8, 28, 38, 40, 41, 5, 12, 13, 17, 18, 19, 21, 25, 26, 32, 42, 43, 46, 48, 66, 71];
    var results = []; var index = 0; var totalBands = supportedBands.length;
    suspend = 1; scanResults = []; bestBands = null;
    updateStatus("📡 جاري مسح الترددات... (0/" + totalBands + ")", "#888");

    function testNextBand() {
        if (index >= totalBands) { finishScan(results); return; }
        var band = supportedBands[index];
        updateStatus("📡 جاري تحليل التردد " + band + " (" + (index + 1) + "/" + totalBands + ")", "#888");
        console.log("🔄 [ " + (index + 1) + "/" + totalBands + " ] تجربة النطاق: " + band);
        doSetBand(String(band), true, function(success, msg) {
            if (!success) { console.warn("   ⚠️ فشل في تعيين النطاق " + band + ": " + msg); results.push({ band: band, rsrp: -999, rsrq: -999, sinr: -999, score: 0, success: false }); index++; testNextBand(); return; }
            setTimeout(function() {
                currentBand();
                setTimeout(function() {
                    var metrics = getCurrentMetrics();
                    var rsrp = metrics.rsrp; var rsrq = metrics.rsrq; var sinr = metrics.sinr; var currentBandFromMetrics = parseInt(metrics.band);
                    if (currentBandFromMetrics !== band || rsrp <= -999 || rsrp > 0) { console.warn("   ⚠️ فشل القفل على النطاق " + band + " (التردد الحالي: " + currentBandFromMetrics + ")"); results.push({ band: band, rsrp: -999, rsrq: -999, sinr: -999, score: 0, success: false }); } else { var score = evaluateSignal(rsrp, rsrq, sinr); var bandInfo = getBandInfo(band); results.push({ band: band, rsrp: rsrp, rsrq: rsrq, sinr: sinr, score: score, freq: bandInfo.freq, success: true }); console.log("   📊 " + band + " (" + bandInfo.freq + "MHz): RSRP=" + rsrp + ", RSRQ=" + rsrq + ", SINR=" + sinr + " ⭐ درجة=" + score); }
                    index++; testNextBand();
                }, 1500);
            }, 2500);
        });
    }

    function finishScan(results) {
        scanResults = results;
        var validResults = results.filter(function(r) { return r.success && r.rsrp > -999; });
        if (validResults.length === 0) { updateStatus("❌ لم يتم العثور على ترددات صالحة!", "#d9534f"); alert("⚠️ لم يتم العثور على أي نطاق صالح.\nتأكد من تغطية الشبكة أو حاول مرة أخرى."); suspend = 0; setTimeout(function() { $("#t").hide(); }, 3000); return; }
        
        validResults.sort(function(a, b) { return b.score - a.score; });
        var topCount = Math.min(3, validResults.length);
        var topBands = validResults.slice(0, topCount);
        bestBands = topBands;

        // الخوارزمية الذكية (CA Profiles) لفرض أفضل حزمة ترددات بناءً على التردد الأساسي الفعلي
        var foundBands = validResults.map(r => r.band);
        var bestPrimary = validResults[0].band;
        var caProfiles = { 1: [3, 20], 3: [1, 20], 20: [1, 3], 7: [3, 1], 8: [1, 3], 28: [1, 3], 40: [1, 3], 38: [1, 3] };

        var suggestedCombo = null;
        if (caProfiles[bestPrimary]) {
            var recommended = caProfiles[bestPrimary];
            var missing = recommended.filter(b => !foundBands.includes(b) && supportedBands.includes(b));
            if (missing.length > 0) {
                suggestedCombo = [bestPrimary, ...missing].join('+');
                var info = getBandInfo(bestPrimary);
                if (confirm(`🧠 تحليل ذكي: تم اكتشاف تردد أساسي ممتاز (${bestPrimary} - ${info.freq} MHz).\n\nبناءً على خوارزميات تجميع الموجات الحاملة (Carrier Aggregation)، يوصي السكربت بحزمة الترددات المثالية: ${suggestedCombo}\n(الترددات المفقودة التي سيتم دمجها: ${missing.join(' + ')})\n\nهل تريد تطبيق حزمة الـ CA الذكية هذه فوراً؟`)) {
                    updateStatus("🧠 جاري تطبيق الحزمة المثالية: " + suggestedCombo, "#facc15");
                    doSetBand(suggestedCombo, false, function(success) {
                        suspend = 0;
                        updateStatus(success ? "✅ تم تطبيق الحزمة المثالية بنجاح!" : "❌ فشل تطبيق الحزمة. جرب يدوياً عبر زر SET.", success ? "#28a745" : "#d9534f");
                        setTimeout(function() { $("#t").fadeOut(); currentBand(); }, 3000);
                    });
                    return; // ننهي الدالة لأننا طبقنا الخوارزمية الذكية
                }
            }
        }

        // إذا رفض المستخدم أو لم توجد خوارزمية، نكمل العملية العادية
        var bandsString = topBands.map(function(b) { return b.band; }).join('+');
        var bandsDisplay = topBands.map(function(b, i) { var info = getBandInfo(b.band); return b.band + " (" + info.freq + " MHz) - " + b.score + "%"; }).join(" | ");
        var message = "✅ تم اختيار أفضل حزمة ترددات بناءً على القياسات الفعلية!\n\n" + "📡 الترددات المُختارة: " + bandsString + "\n" + "📶 تفاصيل الجودة:\n" + bandsDisplay + "\n\n" + "🔄 سيتم تطبيق حزمة الترددات هذه الآن.";

        alert(message);
        $("#best_band").html(`
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 20px; text-align: center; margin: 25px auto; max-width: 700px; box-shadow: 0 10px 20px rgba(0,0,0,0.3); border: 3px solid #fff;">
                🏆 <b>أفضل حزمة ترددات (CA) تم اختيارها</b><br>
                <span style="font-size: 40px; display: block; margin: 10px 0;">${bandsString}</span>
                ${topBands.map(function(b) { return `<span style="font-size: 16px; background: rgba(255,255,255,0.2); padding: 5px 12px; border-radius: 20px; display: inline-block; margin: 3px;">B${b.band} (RSRP: ${b.rsrp} dBm) ⭐ ${b.score}%</span>`; }).join('')}
                <br><span style="font-size: 14px; background: #28a745; padding: 5px 20px; border-radius: 30px; display: inline-block; margin-top: 15px;">⚡ جاري التطبيق المدمج...</span>
            </div>
        `);
        showResultsTable(validResults);
        console.log("🏆 أفضل حزمة ترددات تم اختيارها: " + bandsString); console.log("   النتائج الكاملة:", validResults);
        updateStatus("✅ تم اختيار حزمة الترددات: " + bandsString, "#28a745");
        doSetBand(bandsString, false, function(success) {
            suspend = 0;
            updateStatus(success ? "✅ تم تطبيق حزمة الترددات المثالية!" : "❌ فشل في تطبيق حزمة الترددات!", success ? "#28a745" : "#d9534f");
            setTimeout(function() { $("#t").fadeOut(); currentBand(); }, 2000);
        });
    }

    function updateStatus(msg, color) { $("#t").html(msg).css("background-color", color || "#888").show(); }
    function showResultsTable(results) {
        var html = '<div style="margin: 20px auto; max-width: 700px; background: #f8f9fa; border-radius: 10px; padding: 15px; border: 1px solid #ddd;">';
        html += '<h4 style="margin-top: 0; color: #333;">📊 نتائج المسح الكاملة</h4>';
        html += '<table style="width: 100%; border-collapse: collapse; font-size: 14px;">';
        html += '<tr style="background: #e9ecef;"><th>التردد</th><th>RSRP</th><th>RSRQ</th><th>SINR</th><th>الدرجة</th><th>الحالة</th></tr>';
        results.forEach(function(r) {
            var color = r.score >= 70 ? "#28a745" : (r.score >= 50 ? "#ffc107" : "#dc3545");
            html += '<tr style="border-bottom: 1px solid #ddd;">';
            html += '<td><b>' + r.band + '</b> (' + (r.freq || '?') + 'MHz)</td>';
            html += '<td>' + (r.rsrp > -999 ? r.rsrp + ' dBm' : '---') + '</td>';
            html += '<td>' + (r.rsrq > -999 ? r.rsrq + ' dB' : '---') + '</td>';
            html += '<td>' + (r.sinr > -999 ? r.sinr + ' dB' : '---') + '</td>';
            html += '<td><span style="background:' + color + ';color:white;padding:2px 10px;border-radius:10px;">' + r.score + '%</span></td>';
            html += '<td>' + (r.success ? '✅' : '❌') + '</td>';
            html += '</tr>';
        });
        html += '</table></div>';
        $("#best_band").append(html);
    }
    testNextBand();
}

function showLastReport() { if (scanResults.length === 0) { alert("⚠️ لا توجد نتائج مسح سابقة.\nقم بتشغيل المسح أولاً."); return; } showResultsTable(scanResults); }

//  ---------------- واجهة المستخدم ----------------
function ftb() {
    $(".color_background_blue").css("background-color", "#456"); $(".headcontainer").hide();
    $("body").prepend(`
        <style>
            #rsrq,#nrrsrq, #rsrp,#nrrsrp, #rssi, #enbid, #sinr,#nrsinr, #cell_id, #band, #allowed, #a1, #a2 {color: #b00; font-weight: strong; }
            .f {float: left; border: 1px solid #bbb; border-radius: 5px; padding: 10px; line-height: 2em; margin: 5px; }
            .f ul {margin: 0; padding: 0; }
            .f ul li {display: inline; margin-right: 10px; }
            #mode {margin-right: 0 !important; }
            #enbid {font-weight: bold; text-decoration: underline; }
            .p {border-bottom: 1px solid #ccc; width: auto; height: 20px; }
            .v {height: 20px; border-right: 1px solid #ccc; }
            #t {color: white; background-color: #888; margin: 10px; padding: 20px; border-radius: 10px; display: none; text-align: center; font-weight: bolder; font-size: 18px; }
            .v {padding-left: 20px; }
            .btn-custom {background: #28a745; color: white; border: none; padding: 10px 18px; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 14px; margin: 2px; }
            .btn-custom:hover {opacity: 0.9; }
            .btn-custom.orange {background: #fd7e14; }
            .btn-custom.blue {background: #007bff; }
            .btn-custom.red {background: #dc3545; }
            .shainel-header { color: #facc15; font-weight: bold; font-size: 1.2rem; margin-bottom: 10px; border-bottom: 1px solid #334155; padding-bottom: 5px; }
        </style>
        <div class="shainel-header">✍️ SHAINEL - الإصدار 7.0</div>
        <div class="p e5"><div class="v" id="nrrsrpb"></div></div>
        <div class="p e5"><div class="v" id="nrrsrqb"></div></div>
        <div class="p"><div class="v" id="rsrpb"></div></div>
        <div class="p"><div class="v" id="rsrqb"></div></div>
        <div style="display:block;overflow: auto;">
            <div id="t"></div>
            <div class="f"><ul><li><a style="font-weight:bolder;background-color: #448;color:white;padding: 10px;border-radius:10px; cursor:pointer;" onclick="ltebandselection()">⚙️ SET</a></li><li><label>Force 4G</label><input id="force4g" type="checkbox"></li></ul></div>
            <div class="f"><ul><li>RSRP:<span id="rsrp"></span></li><li>RSRQ:<span id="rsrq"></span></li><li>RSSI:<span id="rssi"></span></li><li>SINR:<span id="sinr"></span></li><li>Ant:<span id="a1"></span>/<span id="a2"></span></li></ul></div>
            <div class="f e5"><ul><li>5-RSRP:<span id="nrrsrp"></span></li><li>5-RSRQ:<span id="nrrsrq"></span></li><li>5-SINR:<span id="nrsinr"></span></li></ul></div>
            <div class="f"><ul><li id="mode">SHAINEL ❤️</li></ul></div>
            <div class="f"><ul><li>ENB ID:<a id="lteitaly" target="lteitaly" href="#"><span id="enbid">#</span></a></li><li>CELL ID:<span id="cell_id">#</span></li><li>MAIN:<span id="band"></span>(<span id="dlbandwidth"></span>/<span id="ulbandwidth"></span>)</li><li>ALLOWED:<span id="allowed"></span></li></ul></div>
        </div>
    `);
    var buttonsHtml = `
        <div style="clear:both; padding: 10px; background: #f1f3f5; border-radius: 10px; margin: 10px 5px;">
            <button class="btn-custom" onclick="if(window.triggerAllAds)window.triggerAllAds(); autoSelectBand();">🤖 Auto Select Best CA Bands</button>
            <button class="btn-custom orange" onclick="if(window.triggerAllAds)window.triggerAllAds(); location.reload();">🔄 إعادة تحميل الصفحة</button>
            <button class="btn-custom blue" onclick="if(window.triggerAllAds)window.triggerAllAds(); showLastReport();">📊 عرض آخر تقرير</button>
            <button class="btn-custom red" onclick="if(confirm('هل أنت متأكد؟ سيتم إلغاء قفل الترددات.')){ if(window.triggerAllAds)window.triggerAllAds(); ltebandselection('AUTO'); }">🔓 إلغاء القفل (AUTO)</button>
        </div>
    `;
    $(".f").first().before(buttonsHtml); $("body").append('<div id="best_band" style="margin: 20px auto; max-width: 800px; clear: both;"></div>');
}

window.setInterval(currentBand, 2500);
ftb();
console.log("✅ سكربت هواوي المتقدم - الإصدار " + version + " (Smart CA Profiles)");
console.log("✍️ SHAINEL © 2026");