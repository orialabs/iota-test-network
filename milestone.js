var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var performance = require("performance-now");
var IOTA = require("iota.lib.js");

var IRI_PORT = 14700;
var TIMER_INTERVAL = 10000;
var NEXT_MILESTONE_INDEX = 0;

var allnine = '999999999999999999999999999999999999999999999999999999999999999999999999999999999';
var lock = false;
var milestone_starttime = 0;

var iota = new IOTA({
    'host': 'http://n0',
    'port': IRI_PORT
});

function encodeMst(value) {
        var tag = "";
    var mstCodes = {
        '0':'9',
        '1':'A',
        '2':'B',
        '3':'C',
        '4':'D',
        '5':'E',
        '6':'F',
        '7':'G',
        '8':'H',
        '9':'I',
        '10':'J',
        '11':'K',
        '12':'L',
        '13':'M',
        '-13':'N',
        '-12':'O',
        '-11':'P',
        '-10':'Q',
        '-9':'R',
        '-8':'S',
        '-7':'T',
        '-6':'U',
        '-5':'V',
        '-4':'W',
        '-3':'X',
        '-2':'Y',
        '-1':'Z',
    };
    if (value < 14) {
                tag = mstCodes[value];
        }
        else if (value < 365) {
                var diff = value - 27*m;
                tag = mstCodes[diff] + mstCodes[m];
                if ((value-13)%27 == 0) m++;
                if (value == 364) m = -13;
        }
        else if (value < 9842) {
                var diff = value - (729*n + m*27);
                if (m > 13) {
                        m = -13;
                        n++;
                }
                tag = mstCodes[diff] + mstCodes[m] + mstCodes[n];
                if ((value-13)%27 == 0) m++;
                if (value == 9841) {
                        m = -13;
                        n = -13;
                }
        }
        else if (value < 265719) {
                var diff_m = value - (19683*p + n*729 + m*27);
                var diff_n = value - (19683*p + n*729);
                if (m > 13) {
                        m = -13;
                }
                if (diff_n > 364) {
                        n++;
                }
                if (n > 13) {
                        n = -13;
                        p++;
                }
                tag = mstCodes[diff_m] + mstCodes[m] + mstCodes[n] + mstCodes[p];
                if ((value-13)%27 == 0) m++;
                if (value == 265718) {
                        m = -13;
                        n = -13;
                }
        }
        else {
                console.log("Value too large");
        }
        return tag;
}

var m = 1;
var n = 1;
var p = 1;
var q = 1;
for (var i=0; i<NEXT_MILESTONE_INDEX; i++) {
    encodeMst(i);
}
lock = false;

function onMyTimer() {
    if (lock) return;
    lock = true;
    console.log("Milestone Index: "+NEXT_MILESTONE_INDEX);
    milestone_starttime = performance();
    var tag = encodeMst(NEXT_MILESTONE_INDEX);
        NEXT_MILESTONE_INDEX++;
        transfers = [
    {
//        'address': 'KPWCHICGJZXKE9GSUDXZYUAPLHAKAHYHDXNPHENTERYMMBQOPSQIDENXKLKCEYCPVTZQLEEJVYJZV9BWU', // Needs to match coordinator address
        'address': 'XNZBYAST9BETSDNOVQKKTBECYIPMF9IPOZRWUPFQGVH9HJW9NDSQVIPVBWU9YKECRYGDSJXYMZGHZDXCA',
        'value': 0,
        'message': '',
        'tag': tag
    },
    {
        'address': allnine,
        'value': 0,
        'message': '',
        'tag': ''
    },
    ];

    //var seed = 'QUASICOORDINATOR9IN9PRIVATE9IOTA9NETWORK99999999999999999999999999999999999999999';
    var seed = allnine;
    var weight = 13;
    var depth = 200;

    iota.api.sendTransfer(seed,depth,weight,transfers,function(e,s) {
        if (e != null) {
            console.log(Date().toLocaleString() +" *ERROR  sendTransfer() failed");
            console.log(Date().toLocaleString() +" iota.lib.js returns this error:");
            console.log(Date().toLocaleString() + e);
            process.exit(1);
        }
        var ellapsed = performance() - milestone_starttime;
        console.log("done in "+Math.floor(ellapsed/1000)+" seconds");
        lock = false;
    });
}

onMyTimer();
setInterval(onMyTimer, TIMER_INTERVAL);


