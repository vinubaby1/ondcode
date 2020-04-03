var origins = [];
var destinations = [];
var transit
const d = '-';

var firstpart = [];
var records = [];


function createTable(tableData) {
    var table = document.createElement('table');
    var tableBody = document.createElement('tbody');
  
    tableData.forEach(function(rowData) {
      rowData.forEach(function(cellData) {
        var row = document.createElement('tr');
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode(cellData));
        row.appendChild(cell);
        
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
    origins.forEach(element => {
        //console.log(element);
        var rec;
        if(element.Flag=="Online"){
            rec = element.Origin + d + transit;
            firstpart.push(rec);
        }  
        rec = "";
        element.Gateways.forEach(gateway => {
            rec = element.Origin + d + gateway.g.trim() + d + transit;
            firstpart.push(rec);
        }); 
      });

     //console.log(firstpart);
     CreateSecondParts();
     createTable([records]);
     records.forEach(element => {
         console.log(element);
     });

}

var records = [];
function CreateSecondParts()
{
    //var rec = firstpart; 
    firstpart.forEach(firstrec => {
        //console.log("FirstPart==>"+firstrec);
        destinations.forEach(destination => {
            //console.log("====>"+destination.Destination);
            if(destination.Flag=="Online"){
                addRecord(firstrec + d + destination.Destination);
            }

            destination.Gateways.forEach(gateway => {
                addRecord(firstrec + d + gateway.g + d + destination.Destination);
            });
        });
    }); 
}

function addRecord(record)
{
    console.log("Add ==>" + record);
    var org = record.substring(0,3);
    var des = record.substring(record.length-3); 

    if(org==des)
    {
      console.log("==================> ORG == DES :: " + org + "-" +des); 
      return;
    }

	if(records.find(x=>x==record)==undefined)
    {	
        records.push(record); 
    }
}

function Loaddata()
{ 
    var origindatalines = document.getElementById("origin").value.split("\n")
    var destinationdatalines = document.getElementById("destination").value.split("\n")
    transit = document.getElementById("transit").value
    
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