var origins = [];
var destinations = [];
var transit
const d = '-';

var firstpart = [];
var records = [];


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
        CreateSecondParts();

      });

     //console.log(firstpart);
     createTable([records]);
     records.forEach(element => {
         console.log(element);
     });

}

var records = [];
function CreateSecondParts()
{
    var ctr = 1;
    //var rec = firstpart; 
    firstpart.forEach(firstrec => {
        //console.log("FirstPart==>"+firstrec);
        destinations.forEach(destination => {
            //console.log("====>"+destination.Destination);
            if(destination.Flag=="Online"){
                var res= addRecord(ctr + " # " + firstrec + d + destination.Destination);
                if(res==true)ctr++;
            }

            destination.Gateways.forEach(gateway => {
                var res= addRecord(ctr + " # " + firstrec + d + gateway.g + d + destination.Destination);
                if(res==true)ctr++;
            }); 
        });
    }); 
    firstpart =[];
}

function addRecord(record)
{
    console.log("Add ==>" + record);
    var ptr = record.search('#'); 
    var org = record.substring(ptr+2,ptr+5);
    var des = record.substring(record.length-3); 
    console.log("+++++++++++++++++++++++> ORG == DES :: '" + org + "'-'" +des); 

    if(org==des)
    {
      console.log("==================> ORG == DES :: " + org + "-" +des); 
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