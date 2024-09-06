const snmp = require('./original');

var {SNMP_NetDevice} = require('./snmp_networking');



async function test() {

    var myDev = new SNMP_NetDevice("172.16.0.1", "BW15NMp");

    console.log("Before")

    await myDev.UpdateDetails();

    console.log("After")
}
//test();


async function fullWalk(ip, community) {
    let lastOID = '1.3.6.1.2.1.2.2';
    var varBinds = null;
    let fullSet = [];
    const repeaters=50;
    let snmpSession = snmp.createSession(ip, community, { version: snmp.Version2c });
    do {
        varBinds = await snmpSession.getBulkAsync([lastOID],0,repeaters);
        for (let myVarBind of varBinds) {
            if (snmp.ObjectType[myVarBind.type]) 
                myVarBind.type = snmp.ObjectType[myVarBind.type];
            else
                console.log(`Unknown Type ${myVarBind.type}`);
            fullSet.push(myVarBind);
            lastOID = myVarBind.oid;
        }
        console.log(`Received ${varBinds.length} OIDs ending in ${lastOID}`);
    } while(varBinds.length>1)
    
}

fullWalk("172.16.0.1","BW15NMp")
