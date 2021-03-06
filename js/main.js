var origins = [];
var destinations = [];
var transit =[];
const d = '-';

var firstpart = [];
var records = [];

var virRec =[];

function createTable(tableData) {
    var table = document.createElement('table');
    table.border=0;
    table.cellSpacing=10;
    table.cellPadding=10;
    var tableBody = document.createElement('tbody');
    var ctr=1;
    tableData.forEach(function(rowData) {
      rowData.forEach(function(cellData) {
        var row = document.createElement('tr');
        var cell1 = document.createElement('td'); 
        var cell = document.createElement('td');
        var cell2 = document.createElement('td');

        cell1.appendChild(document.createTextNode(ctr));
        //cell.appendChild(document.createTextNode(cellData));
        //cell.innerHTML=cellData;
        var pt = cellData.search('#')+1;
        if(pt!=-1)
        {
            cell.innerHTML = cellData.substring(pt,cellData.length);
            cell2.innerHTML  = cellData.substring(0,pt);
        }
        //cell.innerHTML=cellData.substring(1,cellData.length);
        row.appendChild(cell1);
        row.appendChild(cell);
        row.appendChild(cell2);

        ctr++; 
      tableBody.appendChild(row);
      });
    });
  
    table.appendChild(tableBody);
    document.getElementById("result").innerHTML="";
    document.getElementById("result").appendChild(table);
  }

  
function CreateCodes()
{
    origins = [];
    destinations = [];
    firstpart = [];
    records = [];
    Loaddata();
    
    virRec=[];
    finRec=[];

    origins.forEach(org=>{
        if(org.Flag=="Online")
        {
            virRec.push({"org":org.Origin, "transit":transit[0]});  
        }
        org.Gateways.forEach(gateway=>{
            virRec.push({"org":org.Origin, "orgg":gateway.g, "transit":transit[0]}); 
        });
    }); 
    virRec.forEach(rec=>{
        console.log(rec);
    });
    console.log("==================");

    
    virRec.forEach(r=>{
        destinations.forEach(dest=>{
            if(dest.Flag=="Online")
            {  
                 finRec.push({"org":r.org,"orgg":r.orgg,"transit":r.transit, "dest":dest.Destination});
            }
            dest.Gateways.forEach(g=>{
                finRec.push({"org":r.org,"orgg":r.orgg,"transit":r.transit, "destg":g.g, "dest":dest.Destination});
             });
        }); 
    });
console.log(finRec.length);
    finRec.forEach(finrec=>{
        var g1 =finrec.orgg==undefined?"":finrec.orgg;
        var g2 =finrec.destg==undefined?"":finrec.destg;
            
         console.log((finrec.org+d+g1+d+finrec.transit+d+g2+d+finrec.dest).replace('--','-'));
    });

/*
    virRec.forEach(rec=>{ 
        destinations.forEach(dest=>{
            if(dest.Flag=="Online")
            {
                virRec.forEach(rec=>{
                    rec.dest=dest.Destination;
                    finRec.push(rec);
                });
            }
        });
        
    });
*/
 

        origins.forEach(element => {
        //console.log(element);
        var rec;
        if(element.Flag=="Online"){
            rec = element.Origin + d + transit;
            firstpart.push(rec); 
            //console.log("1. Online " + rec); v
        } 
      });

      origins.forEach(element => {
        //console.log(element);
        var rec; 
        element.Gateways.forEach(gateway => {
            rec = element.Origin + d + gateway.g.trim() + d + transit;
            firstpart.push(rec); 
            //console.log("1. Offline " + rec); 
        }); 
      });
      CreateSecondParts();
     //console.log(firstpart);
     createTable([records]);
     records.forEach(element => {
         //console.log(element);
     });
}

var records = [];
function CreateSecondParts()
{
    
    destinations.forEach(des =>{ 
            firstpart.forEach(firstrec=>{
                if(des.Flag=="Online")
                {
                    var rec = firstrec + d + des.Destination;
                    addRecord(rec);
                    //console.log(rec);
                }

                des.Gateways.forEach(gateway=>{
                    var rec = firstrec + d + gateway.g + d + des.Destination;
                    addRecord(rec);
                    //console.log(rec);
                });
        });
    });

    /*
    var ctr = 1;
    //var rec = firstpart; 
    firstpart.forEach(firstrec => {
        //console.log("FirstPart==>"+firstrec);
        destinations.forEach(destination => {
            //console.log("====>"+destination.Destination);
            if(destination.Flag=="Online"){
                var rec = ctr + " # " + firstrec + d + destination.Destination;
                var res= addRecord(rec);
                //console.log("2. Online " + rec);   
                if(res==true)ctr++;
            }

            destination.Gateways.forEach(gateway => {
                var rec = ctr + " # " + firstrec + d + gateway.g + d + destination.Destination;
                var res= addRecord(rec);
                //console.log("2. Offline " + rec);    
                if(res==true)ctr++;
            }); 
        });
    }); 
    */
    firstpart =[];
}

function addRecord(record)
{
    //console.log("Add ==>" + record);
    var ptr = record.search('#'); 
    var org = record.substring(ptr+2,ptr+5);
    var des = record.substring(record.length-3); 
   //console.log("+++++++++++++++++++++++> ORG == DES :: '" + org + "'-'" +des); 

    if(org==des)
    {
      //console.log("==================> ORG == DES :: " + org + "-" +des); 
      //records.push(record +"---<b>[INVALID]</b>");  
      return false;
    }

	if(records.find(x=>x==record)==undefined)
    {	
        records.push(record); 
    }

    return true;
}

function Loaddata()
{ 
    var origindatalines = document.getElementById("origin").value.split("\n")
    var destinationdatalines = document.getElementById("destination").value.split("\n")
    transit = document.getElementById("transit").value.split("\n");
    
    LoadOrigin(origindatalines);
    LoadDestination(destinationdatalines); 
}

function LoadOrigin(origindatalines)
{
    origindatalines.forEach(element => {
        var recvalues = element.split(","); 
        //console.log(recvalues);
        var rec = {};
        var gateways = [];
          
        rec["Origin"] = recvalues[0];
        rec["Flag"] = recvalues[1];
        for(var i=2;i<8;i++)
        {
            if(recvalues[i]!=undefined)
            {
                gateways.push({"g" : recvalues[i]})
            }
            //console.log(gateways);
            rec["Gateways"] = gateways;
        }
        origins.push(rec); 
     });
}

function LoadDestination(destinationdatalines)
{
    destinationdatalines.forEach(element => {
        var recvalues = element.split(","); 
        //console.log(recvalues); 
        var rec = {};
        var gateways = [];
          
        rec["Destination"] = recvalues[0];
        rec["Flag"] = recvalues[1];
        //console.log(rec);

        for(var i=2;i<8;i++)
        {
            if(recvalues[i]!=undefined)
            {
                gateways.push({"g" : recvalues[i]})
            }
            //console.log(gateways);
            rec["Gateways"] = gateways;
        }
        destinations.push(rec); 
     });
}




/*
    console.log(origindatalines);
    console.log(destinationdatalines);
    console.log(transitdata);
*/